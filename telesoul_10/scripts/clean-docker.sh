#!/usr/bin/env bash
# 用途: 清理未使用的 Docker image、volume、network
# 參考: MAINTENANCE_GUIDELINES.md, README.md, CONTRIBUTING.md
# 被引用: dev-init.sh, README.md, MAINTENANCE_GUIDELINES.md, CONTRIBUTING.md
# 負責人: TeleSoul Team

set -euo pipefail
docker image prune -a -f
docker volume prune -f
docker network prune -f
echo "[INFO] Docker 資源清理完成" 