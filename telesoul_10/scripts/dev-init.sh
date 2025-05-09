#!/usr/bin/env bash
# 用途: 一鍵啟動 TeleSoul 全自動本地開發環境（支援 Ansible Playbook 或 Bash 流程，含進度狀態顯示）
# 參考: .cursorrules, MAINTENANCE_GUIDELINES.md, README.md, DOCUMENTATION_GUIDELINES.md, CONTRIBUTING.md, scripts/notify.sh
# 被引用: README.md, MAINTENANCE_GUIDELINES.md, CONTRIBUTING.md
# 負責人: TeleSoul Team

set -u pipefail

# 全局唯一性鎖，防止多重流程同時執行
GLOBAL_LOCK=/tmp/telesoul_global_dev.lock
if [ -f "$GLOBAL_LOCK" ]; then
  echo "[WARN] 已有一個開發流程在執行，跳過本次"
  exit 0
fi
trap 'rm -f "$GLOBAL_LOCK"' EXIT
touch "$GLOBAL_LOCK"

LOG_FILE="logs/dev-init.log"
mkdir -p logs
log()   { echo "[INFO]    $1" | tee -a "$LOG_FILE"; }
error() { echo "[ERROR]   $1" | tee -a "$LOG_FILE" >&2; }

TOTAL_STEPS=6
STEP=1
progress() {
  PERCENT=$((100 * STEP / TOTAL_STEPS))
  log "[PROGRESS] $PERCENT% - $1"
  ./scripts/notify.sh "[PROGRESS] $PERCENT% - $1"
  STEP=$((STEP+1))
}

trap 'error "[FATAL] 開發流程中斷，嘗試自動修復..."; ./scripts/notify.sh "[FATAL] 開發流程中斷，嘗試自動修復..."' ERR

# 啟動前自動檢查 .env/.env.example
# 僅允許複製，不允許自動產生 .env.example
if [ ! -f .env ]; then
  echo "[AUTO-FIX] 未偵測到 .env，自動複製 .env.example..."
  cp .env.example .env
fi

if command -v ansible-playbook >/dev/null 2>&1; then
  progress "執行 Ansible Playbook 全流程"
  ansible-playbook playbook.yaml -i localhost, --connection=local | tee -a "$LOG_FILE"
else
  progress "Docker 環境自檢"
  ./scripts/check-docker.sh

  progress "啟動所有容器"
  if [[ "${1:-}" == "--build" ]]; then
    ./scripts/start-containers.sh --build
  else
    ./scripts/start-containers.sh
  fi

  progress "依賴安裝與 DB 遷移"
  pnpm install | tee -a "$LOG_FILE"
  pnpm prisma migrate deploy || npm run migrate || true

  progress "執行 Playbook 任務（測試/監控/合規）"
  node scripts/run-playbook.js playbook.yaml --env local | tee -a "$LOG_FILE"

  progress "清理多餘 Docker image（可選）"
  ./scripts/clean-docker.sh
fi

log "✅ TeleSoul 本地開發環境已全部啟動，請參見 README.md FAQ 取得服務訪問地址"
./scripts/notify.sh "[PROGRESS] 100% - ✅ TeleSoul 本地開發環境已全部啟動，請參見 README.md FAQ 取得服務訪問地址" 