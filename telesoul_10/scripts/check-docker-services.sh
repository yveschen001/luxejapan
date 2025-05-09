#!/usr/bin/env bash
# 用途: 檢查 docker-compose.yml 中所有服務是否已啟動，未啟動則自動啟動
# 參考: MAINTENANCE_GUIDELINES.md, DOCUMENTATION_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]    $1"; }
error() { echo "[ERROR]   $1" >&2; }

if [ ! -f docker-compose.yml ]; then
  error "未找到 docker-compose.yml，請在專案根目錄執行。"
  exit 1
fi

expected_services=$(docker compose config --services)
running_services=$(docker compose ps --services --filter "status=running")

missing=()
for svc in $expected_services; do
  if ! echo "$running_services" | grep -q "^$svc$"; then
    missing+=("$svc")
  fi
done

if [ ${#missing[@]} -eq 0 ]; then
  log "所有 docker-compose 服務均已啟動"
  exit 0
else
  error "以下服務未啟動: ${missing[*]}"
  log "自動啟動缺失服務..."
  docker compose up -d ${missing[*]}
  sleep 3
  # 再次檢查
  running_services=$(docker compose ps --services --filter "status=running")
  still_missing=()
  for svc in $expected_services; do
    if ! echo "$running_services" | grep -q "^$svc$"; then
      still_missing+=("$svc")
    fi
  done
  if [ ${#still_missing[@]} -eq 0 ]; then
    log "所有服務已成功啟動"
    exit 0
  else
    error "以下服務啟動失敗: ${still_missing[*]}"
    exit 1
  fi
fi 