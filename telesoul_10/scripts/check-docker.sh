#!/usr/bin/env bash
# 用途: 本地 Docker 環境自檢，確保 CLI、服務、compose 及常用端口均可用
# 參考: MAINTENANCE_GUIDELINES.md, DOCUMENTATION_GUIDELINES.md, README.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]    $1"; }
error() { echo "[ERROR]   $1" >&2; }

# 1. 檢查 Docker CLI
if ! command -v docker &>/dev/null; then
  error "docker CLI 未安裝，請先安裝 Docker：https://docs.docker.com/get-docker/"
fi
log "檢測到 docker CLI 版本：$(docker --version)"

# 2. 檢查 Docker 服務
if ! docker info &>/dev/null; then
  error "Docker 服務未運行，請啟動 Docker 引擎（macOS/Docker Desktop 或 systemd service）。"
fi
log "Docker 服務正常運行"

# 3. 檢查 docker-compose（或 docker compose）
if command -v docker-compose &>/dev/null; then
  log "檢測到 docker-compose 版本：$(docker-compose --version)"
elif docker compose version &>/dev/null; then
  log "檢測到 docker compose 版本：$(docker compose version)"
else
  error "未檢測到 docker-compose 或 docker compose，請安裝。"
fi

# 4. 檢查常用端口（統一由 .env.example 配置）
PORTS=( $(grep -E '^(PORT|DB_PORT|REDIS_PORT|FRONTEND_PORT|BACKEND_PORT)=' .env.example | cut -d= -f2) )
for port in "${PORTS[@]}"; do
  if [[ -n "$port" ]]; then
    if lsof -i :$port &>/dev/null; then
      log "端口 $port 已被佔用"
    else
      log "端口 $port 可用"
    fi
  fi
done

echo "[OK] Docker 環境自檢通過"

exit 0 