#!/usr/bin/env bash
# 用途: 自動修復 Postgres 容器啟動異常（清理資料卷並重啟）
# 參考: MAINTENANCE_GUIDELINES.md, check-containers.sh
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[AUTO-FIX] $1"; }
error() { echo "[AUTO-FIX] $1" >&2; }

log "開始自動修復 Postgres 容器..."
log "停止並移除 Postgres 容器..."
docker stop telesoul-postgres || true
docker rm telesoul-postgres || true
log "清理 Postgres 資料卷..."
docker volume rm $(docker volume ls -q | grep postgres) || true
log "重新啟動 Postgres 容器..."
docker-compose up -d postgres
log "等待 Postgres 容器健康..."
for i in {1..10}; do
  sleep 3
  if docker inspect --format='{{.State.Health.Status}}' telesoul-postgres | grep -q healthy; then
    log "Postgres 容器已恢復健康！"
    exit 0
  fi
done
error "Postgres 容器自動修復失敗，請人工介入。"
exit 1 