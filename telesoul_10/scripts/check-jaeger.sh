#!/usr/bin/env bash
# 檢查 Jaeger UI 可用性
status=$(curl -s -o /dev/null -w "%{http_code}" http://jaeger:16686/api/services)
if [[ "$status" -ne 200 ]]; then
  echo "Jaeger API returned $status" >&2
  exit 1
fi 