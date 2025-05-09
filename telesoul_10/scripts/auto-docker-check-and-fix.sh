#!/usr/bin/env bash
# 用途: 一鍵自動檢查、啟動、健康檢查並自動修復 Docker 服務
# 參考: MAINTENANCE_GUIDELINES.md, DOCUMENTATION_GUIDELINES.md, README.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]  $1"; }
warn()  { echo "[WARN]  $1"; }
error() { echo "[ERROR] $1" >&2; }

# 1. 檢查 Docker 環境
./scripts/check-docker.sh || { error "Docker 環境異常，請先修復"; exit 1; }

# 2. 啟動容器
log "啟動 Docker 容器..."
docker-compose up -d --build

# 3. 健康檢查與自動修復
services=(telesoul-postgres telesoul-redis telesoul-minio telesoul-auth telesoul-gateway)
MAX_RETRIES=3

for svc in "${services[@]}"; do
  retry=0
  while [ $retry -lt $MAX_RETRIES ]; do
    health=$(docker inspect --format='{{.State.Health.Status}}' "$svc" 2>/dev/null || echo "none")
    if [ "$health" = "healthy" ]; then
      log "$svc 狀態: healthy"
      break
    elif [ "$health" = "unhealthy" ]; then
      warn "$svc 狀態: unhealthy，嘗試自動修復（第 $((retry+1)) 次）"
      # 自動修復策略：Postgres 清理資料卷重啟，其它重啟容器
      if [[ "$svc" == "telesoul-postgres" ]]; then
        ./scripts/auto-fix-postgres.sh
      else
        docker-compose restart "$svc"
      fi
      sleep 5
    elif [ "$health" = "none" ]; then
      warn "$svc 未設置 healthcheck，建議補全"
      break
    else
      warn "$svc 狀態未知: $health"
      docker-compose restart "$svc"
      sleep 5
    fi
    retry=$((retry+1))
  done
  # 最終檢查
  health=$(docker inspect --format='{{.State.Health.Status}}' "$svc" 2>/dev/null || echo "none")
  if [ "$health" != "healthy" ] && [ "$health" != "none" ]; then
    error "$svc 啟動失敗，請人工排查"
    exit 1
  fi
done

log "所有 Docker 服務已健康啟動！" 