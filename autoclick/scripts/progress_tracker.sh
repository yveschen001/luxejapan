#!/bin/bash

# 設置錯誤處理
set -e
set -o pipefail

# 設置日誌
LOG_FILE="progress_tracker.log"
exec 1> >(tee -a "$LOG_FILE") 2>&1

echo "=== 開始進度追蹤 ==="
echo "時間: $(date)"

# 1. 檢查項目結構
echo "檢查項目結構..."
./scripts/check_project_structure.sh
STRUCTURE_STATUS=$?

# 2. 檢查文檔一致性
echo "檢查文檔一致性..."
python3 scripts/check_docs.py
DOCS_STATUS=$?

# 3. 檢查代碼風格
echo "檢查代碼風格..."
swiftlint
swiftformat --lint .
STYLE_STATUS=$?

# 4. 檢查 Actor 隔離
echo "檢查 Actor 隔離..."
./scripts/check_actor_isolation.sh
ACTOR_STATUS=$?

# 5. 檢查快捷鍵
echo "檢查快捷鍵..."
python3 scripts/check_shortcuts.py
SHORTCUTS_STATUS=$?

# 6. 檢查數據模型
echo "檢查數據模型..."
python3 scripts/check_data_schema.py
SCHEMA_STATUS=$?

# 7. 檢查單元測試
echo "檢查單元測試..."
xcodebuild test -scheme AutoClicker -destination 'platform=macOS'
UNIT_TESTS_STATUS=$?

# 8. 檢查 UI 測試
echo "檢查 UI 測試..."
xcodebuild test -scheme AutoClickerUITests -destination 'platform=macOS'
UI_TESTS_STATUS=$?

# 9. 檢查最終清單
echo "檢查最終清單..."
grep -q "☐" docs/FINAL_CHECKLIST.md
CHECKLIST_STATUS=$?

# 生成進度報告
echo "=== 進度報告 ==="
echo "時間: $(date)"
echo "項目結構: $([ $STRUCTURE_STATUS -eq 0 ] && echo "✅" || echo "❌")"
echo "文檔一致性: $([ $DOCS_STATUS -eq 0 ] && echo "✅" || echo "❌")"
echo "代碼風格: $([ $STYLE_STATUS -eq 0 ] && echo "✅" || echo "❌")"
echo "Actor 隔離: $([ $ACTOR_STATUS -eq 0 ] && echo "✅" || echo "❌")"
echo "快捷鍵: $([ $SHORTCUTS_STATUS -eq 0 ] && echo "✅" || echo "❌")"
echo "數據模型: $([ $SCHEMA_STATUS -eq 0 ] && echo "✅" || echo "❌")"
echo "單元測試: $([ $UNIT_TESTS_STATUS -eq 0 ] && echo "✅" || echo "❌")"
echo "UI 測試: $([ $UI_TESTS_STATUS -eq 0 ] && echo "✅" || echo "❌")"
echo "最終清單: $([ $CHECKLIST_STATUS -eq 1 ] && echo "✅" || echo "❌")"

# 計算總體進度
TOTAL_CHECKS=9
PASSED_CHECKS=0

[ $STRUCTURE_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $DOCS_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $STYLE_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $ACTOR_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $SHORTCUTS_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $SCHEMA_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $UNIT_TESTS_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $UI_TESTS_STATUS -eq 0 ] && ((PASSED_CHECKS++))
[ $CHECKLIST_STATUS -eq 1 ] && ((PASSED_CHECKS++))

PROGRESS=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
echo "總體進度: $PROGRESS%"

# 如果有任何檢查失敗，建議運行自動修復
if [ $PASSED_CHECKS -lt $TOTAL_CHECKS ]; then
    echo "建議運行自動修復腳本..."
    ./scripts/auto_repair.sh
fi

echo "=== 進度追蹤完成 ===" 