#!/usr/bin/env bash
# 用途: 啟動所有 Docker 容器
# 參考: docs/dev/DOCKER_DEVELOPMENT_GUIDELINES.md, MAINTENANCE_GUIDELINES.md, README.md
# 被引用: dev-init.sh, playbook.yaml, README.md, MAINTENANCE_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]    $1"; }
error() { echo "[ERROR]   $1" >&2; }

log "啟動 Docker 容器..."
if [[ "${1:-}" == "--build" ]]; then
  docker-compose up -d --build
else
  docker-compose up -d
fi

log "等待容器健康檢查..."
if ! ./scripts/check-containers.sh; then
  error "健康檢查未通過，啟動流程終止。"
  exit 1
fi

log "執行 Playbook..."
node scripts/run-playbook.js playbook.yaml --env local 