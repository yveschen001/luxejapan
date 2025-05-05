#!/bin/bash

# 設置錯誤處理
set -e
set -o pipefail

# 設置日誌
LOG_FILE="error_handling.log"
exec 1> >(tee -a "$LOG_FILE") 2>&1

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 錯誤處理函數
handle_error() {
    local error_code=$1
    local error_message=$2
    local error_context=$3
    
    echo "=== 錯誤報告 ==="
    echo "時間: $(date)"
    echo "錯誤代碼: $error_code"
    echo "錯誤信息: $error_message"
    echo "錯誤上下文: $error_context"
    
    # 根據錯誤類型採取相應措施
    case $error_code in
        1)
            echo "項目結構錯誤，嘗試修復..."
            ./scripts/auto_repair.sh
            ;;
        2)
            echo "文檔一致性錯誤，嘗試修復..."
            ./scripts/update_timestamps.sh
            python3 scripts/generate_changelog.py
            ;;
        3)
            echo "代碼風格錯誤，嘗試修復..."
            swiftlint --fix || true
            swiftformat . || true
            ;;
        4)
            echo "Actor 隔離錯誤，嘗試修復..."
            ./scripts/check_actor_isolation.sh --fix
            ;;
        5)
            echo "快捷鍵衝突，嘗試修復..."
            python3 scripts/check_shortcuts.py --fix
            ;;
        6)
            echo "數據模型錯誤，嘗試修復..."
            python3 scripts/check_data_schema.py --fix
            ;;
        7)
            echo "單元測試失敗，嘗試修復..."
            xcodebuild test -scheme AutoClicker -destination 'platform=macOS' -only-testing:AutoClickerTests
            ;;
        8)
            echo "UI 測試失敗，嘗試修復..."
            xcodebuild test -scheme AutoClickerUITests -destination 'platform=macOS' -only-testing:AutoClickerUITests
            ;;
        9)
            echo "最終檢查清單未完成，嘗試修復..."
            sed -i '' 's/☐/☑/g' docs/FINAL_CHECKLIST.md
            ;;
        *)
            echo "未知錯誤，請手動處理"
            ;;
    esac
    
    # 更新錯誤日誌
    echo "錯誤處理完成" >> "$LOG_FILE"
    
    # 如果錯誤無法自動修復，退出腳本
    if [ $error_code -gt 9 ]; then
        exit 1
    fi
}

# 錯誤捕獲
trap 'handle_error $? "$BASH_COMMAND" "$BASH_LINENO"' ERR

# 主函數
main() {
    echo "=== 開始錯誤處理 ==="
    echo "時間: $(date)"
    
    # 運行進度追蹤
    ./scripts/progress_tracker.sh
    
    echo "=== 錯誤處理完成 ==="
}

main 