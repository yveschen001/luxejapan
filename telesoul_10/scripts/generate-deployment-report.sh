#!/usr/bin/env bash
# TeleSoul 部署報告自動生成腳本
# 作用：生成詳細的部署報告，包含部署狀態、變更內容、性能指標等
# 參考: OBSERVABILITY_GUIDELINES.md

set -euo pipefail

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
REPORT_DIR="reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$REPORT_DIR/deployment_report_$TIMESTAMP.md"

# 確保報告目錄存在
mkdir -p "$REPORT_DIR"

# 獲取部署信息
get_deployment_info() {
  echo "獲取部署信息..."
  
  # 獲取當前分支
  local branch=$(git rev-parse --abbrev-ref HEAD)
  
  # 獲取最新提交
  local commit=$(git rev-parse HEAD)
  local commit_msg=$(git log -1 --pretty=%B)
  local commit_author=$(git log -1 --pretty=%an)
  local commit_date=$(git log -1 --pretty=%cd)
  
  # 獲取變更文件
  local changed_files=$(git diff --name-only HEAD^ HEAD)
  
  # 獲取性能指標
  local performance_metrics=$(./scripts/check-performance.sh --json)
  
  # 獲取系統健康狀態
  local health_status=$(./scripts/check-health.sh --json)
  
  # 生成報告
  {
    echo "# TeleSoul 部署報告"
    echo "生成時間: $(date)"
    echo
    echo "## 部署信息"
    echo "- 分支: $branch"
    echo "- 提交: $commit"
    echo "- 提交信息: $commit_msg"
    echo "- 提交者: $commit_author"
    echo "- 提交時間: $commit_date"
    echo
    echo "## 變更內容"
    echo "\`\`\`"
    echo "$changed_files"
    echo "\`\`\`"
    echo
    echo "## 性能指標"
    echo "\`\`\`json"
    echo "$performance_metrics"
    echo "\`\`\`"
    echo
    echo "## 系統健康狀態"
    echo "\`\`\`json"
    echo "$health_status"
    echo "\`\`\`"
    echo
    echo "## 部署檢查清單"
    echo "- [ ] 代碼檢查通過"
    echo "- [ ] 單元測試通過"
    echo "- [ ] 安全掃描通過"
    echo "- [ ] 性能指標達標"
    echo "- [ ] 系統健康狀態正常"
    echo
    echo "## 後續行動"
    echo "1. 監控系統性能"
    echo "2. 檢查錯誤日誌"
    echo "3. 驗證功能正常"
    echo "4. 更新文檔"
  } > "$REPORT_FILE"
  
  echo -e "${GREEN}部署報告已生成: $REPORT_FILE${NC}"
}

# 發送報告通知
send_report_notification() {
  echo "發送報告通知..."
  
  # 檢查是否配置了 Slack Webhook
  if [ -z "${SLACK_WEBHOOK_URL:-}" ]; then
    echo -e "${YELLOW}[警告] 未配置 SLACK_WEBHOOK_URL，跳過通知${NC}"
    return
  fi
  
  # 發送到 Slack
  curl -X POST -H 'Content-type: application/json' \
    --data "{
      \"text\": \"*TeleSoul 部署報告*\n
      時間: $(date)\n
      分支: $(git rev-parse --abbrev-ref HEAD)\n
      提交: $(git rev-parse HEAD)\n
      詳情: $REPORT_FILE\"
    }" \
    "$SLACK_WEBHOOK_URL"
  
  echo -e "${GREEN}報告通知已發送${NC}"
}

# 主函數
main() {
  echo "開始生成部署報告..."
  
  get_deployment_info
  send_report_notification
  
  echo -e "${GREEN}部署報告生成完成${NC}"
}

main 