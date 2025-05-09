#!/usr/bin/env bash
# 用途: 發送自動化流程狀態通知（Slack/Webhook/郵件）
# 參考: MAINTENANCE_GUIDELINES.md, README.md, CONTRIBUTING.md
# 被引用: dev-init.sh, check-containers.sh, run-playbook.js, README.md, MAINTENANCE_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail
MESSAGE="$1"
WEBHOOK_URL="https://hooks.slack.com/services/xxx/yyy/zzz" # 請替換為實際 Webhook

if [ -n "$WEBHOOK_URL" ]; then
  curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"$MESSAGE\"}" "$WEBHOOK_URL"
else
  echo "[NOTIFY] $MESSAGE"
fi 