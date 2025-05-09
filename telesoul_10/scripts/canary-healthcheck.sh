#!/usr/bin/env bash
# TeleSoul Canary Healthcheck Script
# 參考: docs/ops/CI_CD_GUIDELINES.md, playbook.yaml
# 用於金絲雀部署後健康檢查

set -e

SERVICE_URL=${SERVICE_URL:-http://localhost/health}

status=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL")
if [[ "$status" -ne 200 ]]; then
  echo "Canary healthcheck failed: $SERVICE_URL returned $status" >&2
  exit 1
fi

echo "Canary healthcheck passed: $SERVICE_URL returned 200" 