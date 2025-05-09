#!/usr/bin/env bash
# 用途: 檢查所有 Docker 服務健康狀態，並自動等待 starting 狀態
# 參考: MAINTENANCE_GUIDELINES.md, DOCUMENTATION_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]  $1"; }
warn()  { echo "[WARN]  $1"; }
error() { echo "[ERROR] $1" >&2; }

LOCKFILE=/tmp/telesoul_check_containers.lock

# 檢查 lock file 是否存在且進程還活著
if [ -f "$LOCKFILE" ]; then
  old_pid=$(cat "$LOCKFILE")
  if [ -n "$old_pid" ] && kill -0 "$old_pid" 2>/dev/null; then
    log "[WARN] 檢查已在執行（PID: $old_pid），跳過本次"
    exit 0
  else
    log "[WARN] 偵測到殘留 lock file，清理後繼續"
    rm -f "$LOCKFILE"
  fi
fi

echo $$ > "$LOCKFILE"
trap 'rm -f "$LOCKFILE"' EXIT

log "=== [單次健康檢查開始] ==="

# 服務名稱與容器名稱映射
services=(postgres redis minio auth gateway)
all_healthy=true

for svc in "${services[@]}"; do
  container="telesoul-$svc"
  log "檢查 $container 狀態..."
  health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "none")
  
  if [ "$health" = "healthy" ]; then
    log "$container 狀態: healthy"
  elif [ "$health" = "starting" ]; then
    warn "$container 狀態: starting，等待 10 秒再檢查..."
    sleep 10
    health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "none")
    if [ "$health" = "healthy" ]; then
      log "$container 狀態: healthy"
    else
      error "$container 健康檢查超時，請手動排查"
      all_healthy=false
      break
    fi
  elif [ "$health" = "none" ]; then
    warn "$container 無健康檢查，建議補全"
    all_healthy=false
    break
  else
    error "$container 狀態異常: $health"
    all_healthy=false
    break
  fi
done

log "=== [單次健康檢查結束] ==="

if [ "$all_healthy" = true ]; then
  log "所有 Docker 服務健康檢查通過！"
  exit 0
else
  error "Docker 服務健康檢查失敗"
  exit 1
fi 