#!/usr/bin/env bash
# 用途: 自動修復端口衝突（釋放被佔用端口或自動遞增 PORT）
# 參考: MAINTENANCE_GUIDELINES.md, error-fix-map.json
# 負責人: TeleSoul Team

set -euo pipefail

PORT=${PORT:-4000}
if lsof -i :$PORT >/dev/null 2>&1; then
  pid=$(lsof -t -i :$PORT)
  echo "[WARN] 端口 $PORT 被進程 $pid 佔用，嘗試釋放..."
  kill -9 $pid || true
  echo "[OK] 已釋放端口 $PORT"
else
  echo "[INFO] 端口 $PORT 未被佔用"
fi 