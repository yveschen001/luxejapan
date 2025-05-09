#!/usr/bin/env bash
# 用途: 自動補齊 .env，檢查內容完整性並重啟 Docker 服務
# 參考: MAINTENANCE_GUIDELINES.md, ENVIRONMENT_VARIABLE_GUIDELINES.md, DOCUMENTATION_GUIDELINES.md, README.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]    $1"; }
error() { echo "[ERROR]   $1" >&2; }

if [ ! -f .env ]; then
  log "未找到 .env，自動複製 .env.example"
  cp .env.example .env
fi

log "檢查 .env 是否缺少變數..."
missing=$(comm -23 <(grep -v '^#' .env.example | cut -d= -f1 | sort) <(grep -v '^#' .env | cut -d= -f1 | sort))
for key in $missing; do
  value=$(grep "^$key=" .env.example)
  echo "$value" >> .env
  log "自動補齊 $key"
done

log "檢查 .env 是否有空值..."
empty_keys=()
while IFS= read -r line; do
  [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
  key="${line%%=*}"
  val="${line#*=}"
  if [ -z "$val" ]; then
    empty_keys+=("$key")
    # 自動修復：用 .env.example 的預設值補齊
    example_val=$(grep "^$key=" .env.example | head -n1 | cut -d= -f2-)
    if [ -n "$example_val" ]; then
      sed -i '' "s/^$key=$/$key=$example_val/" .env 2>/dev/null || sed -i "s/^$key=$/$key=$example_val/" .env
      log "自動修復 $key，補齊預設值 $example_val"
    else
      log "$key 仍為空，請手動補齊！"
    fi
  fi
done < <(grep -v '^#' .env)

if [ ${#empty_keys[@]} -gt 0 ]; then
  error "以下環境變數仍為空，請依 docs/dev/ENVIRONMENT_VARIABLE_GUIDELINES.md 補齊：${empty_keys[*]}"
fi

log "重新啟動 Docker 服務..."
docker-compose down
docker-compose up -d --build

log "檢查所有服務健康狀態..."
./scripts/check-containers.sh 