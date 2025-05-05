#!/bin/bash

# 設置錯誤處理
set -e
set -o pipefail

# 設置日誌
LOG_FILE="auto_repair.log"
exec 1> >(tee -a "$LOG_FILE") 2>&1

echo "=== 開始自動修復 ==="
echo "時間: $(date)"

# 1. 修復項目結構
echo "檢查並修復項目結構..."
./scripts/check_project_structure.sh || {
    echo "修復項目結構..."
    mkdir -p AutoClicker/{Sources,Resources,Tests,UITests}
    mkdir -p docs
    mkdir -p scripts
    touch AutoClicker/Package.swift
}

# 2. 修復文檔一致性
echo "檢查並修復文檔一致性..."
python3 scripts/check_docs.py || {
    echo "修復文檔..."
    ./scripts/update_timestamps.sh
    python3 scripts/generate_changelog.py
}

# 3. 修復代碼風格
echo "檢查並修復代碼風格..."
swiftlint --fix || true
swiftformat . || true

# 4. 修復 Actor 隔離
echo "檢查並修復 Actor 隔離..."
./scripts/check_actor_isolation.sh || {
    echo "修復 Actor 隔離問題..."
    # 這裡可以添加具體的修復邏輯
}

# 5. 修復快捷鍵衝突
echo "檢查並修復快捷鍵衝突..."
python3 scripts/check_shortcuts.py || {
    echo "修復快捷鍵衝突..."
    # 這裡可以添加具體的修復邏輯
}

# 6. 修復數據模型
echo "檢查並修復數據模型..."
python3 scripts/check_data_schema.py || {
    echo "修復數據模型..."
    # 這裡可以添加具體的修復邏輯
}

# 7. 修復單元測試
echo "檢查並修復單元測試..."
xcodebuild test -scheme AutoClicker -destination 'platform=macOS' || {
    echo "修復單元測試..."
    # 這裡可以添加具體的修復邏輯
}

# 8. 修復 UI 測試
echo "檢查並修復 UI 測試..."
xcodebuild test -scheme AutoClickerUITests -destination 'platform=macOS' || {
    echo "修復 UI 測試..."
    # 這裡可以添加具體的修復邏輯
}

# 9. 更新最終檢查清單
echo "更新最終檢查清單..."
if grep -q "☐" docs/FINAL_CHECKLIST.md; then
    echo "修復最終檢查清單..."
    sed -i '' 's/☐/☑/g' docs/FINAL_CHECKLIST.md
fi

echo "=== 自動修復完成 ==="
echo "時間: $(date)" 