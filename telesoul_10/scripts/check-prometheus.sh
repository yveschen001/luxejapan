#!/usr/bin/env bash
# 查詢 Prometheus uptime
result=$(curl -s 'http://prometheus:9090/api/v1/query?query=up' | jq '.data.result[] | select(.value[1]=="1")')
if [[ -z "$result" ]]; then
  echo "No 'up' metrics found" >&2
  exit 1
fi 