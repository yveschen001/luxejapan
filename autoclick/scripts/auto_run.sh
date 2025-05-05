#!/bin/bash

# AutoClicker 自動化測試與驗收腳本
# 最後更新：2025-05-04 00:06

# 導入錯誤處理和進度追蹤
source ./scripts/error_handling.sh
source ./scripts/progress_tracker.sh

# 設置日誌文件
LOG_FILE="auto_run.log"
echo "開始自動化測試流程..." > "$LOG_FILE"

# 初始化進度
init_progress

# 1. 檢查項目結構
echo "檢查項目結構..."
./scripts/check_project_structure.sh >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 1 $LINENO
fi
update_progress

# 2. 檢查文檔一致性
echo "檢查文檔一致性..."
python3 ./scripts/check_docs.py >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 2 $LINENO
fi
update_progress

# 3. 檢查代碼風格
echo "檢查代碼風格..."
swiftformat --lint . >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 3 $LINENO
fi
update_progress

# 4. 檢查 Actor 隔離
echo "檢查 Actor 隔離..."
./scripts/check_actor_isolation.sh >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 4 $LINENO
fi
update_progress

# 5. 檢查快捷鍵衝突
echo "檢查快捷鍵衝突..."
python3 ./scripts/check_shortcuts.py >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 5 $LINENO
fi
update_progress

# 6. 檢查數據模型
echo "檢查數據模型..."
python3 ./scripts/check_data_schema.py >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 6 $LINENO
fi
update_progress

# 7. 運行單元測試
echo "運行單元測試..."
swift test >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 7 $LINENO
fi
update_progress

# 8. 運行 UI 測試
echo "運行 UI 測試..."
xcodebuild test -scheme AutoClicker -destination 'platform=iOS Simulator,name=iPhone 15' >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 8 $LINENO
fi
update_progress

# 9. 更新文檔時間戳
echo "更新文檔時間戳..."
./scripts/update_docs_timestamp.sh >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 9 $LINENO
fi
update_progress

# 10. 生成更新日誌
echo "生成更新日誌..."
python3 ./scripts/generate_changelog.py >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    handle_error 10 $LINENO
fi
update_progress

# 完成進度
complete_progress

echo "✅ 自動化測試完成"
echo "詳細日誌請查看 $LOG_FILE" 