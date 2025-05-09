#!/usr/bin/env bash
# 用途: 檢查 Redis 與 MinIO 服務健康狀態
# 參考: MAINTENANCE_GUIDELINES.md, docs/dev/DOCKER_DEVELOPMENT_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]    $1"; }
error() { echo "[ERROR]   $1" >&2; }

# Redis 健康檢查
log "檢查 Redis 狀態..."
if ! docker exec telesoul-redis redis-cli -a "$REDIS_PASSWORD" ping | grep -q PONG; then
  error "Redis 未就緒"
  exit 1
fi
log "Redis 健康啟動"

# MinIO 健康檢查
log "檢查 MinIO 狀態..."
if ! curl -sf http://localhost:${MINIO_PORT:-9000}/minio/health/live; then
  error "MinIO 未就緒"
  exit 1
fi
log "MinIO 健康啟動" 