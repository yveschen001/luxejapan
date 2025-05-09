#!/usr/bin/env bash
# 用途: 自動重試數據庫連接並刷新遷移
# 參考: MAINTENANCE_GUIDELINES.md, error-fix-map.json
# 負責人: TeleSoul Team

set -euo pipefail

RETRY=3
for i in $(seq 1 $RETRY); do
  echo "[INFO] 第 $i 次重試數據庫連接..."
  if npx prisma migrate deploy; then
    echo "[OK] 數據庫遷移成功"
    exit 0
  fi
  sleep 2
done

echo "[ERROR] 數據庫連接重試失敗，請檢查配置或服務狀態" >&2
exit 1 