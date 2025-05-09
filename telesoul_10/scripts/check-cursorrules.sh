#!/usr/bin/env bash
# TeleSoul .cursorrules 唯一性自動檢查與清理腳本
# 作用：確保全專案僅有根目錄一份 .cursorrules，發現多餘副本自動刪除
# 參考: DOCUMENTATION_GUIDELINES.md

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

find "$ROOT_DIR" -name '.cursorrules' ! -path "$ROOT_DIR/.cursorrules" -exec rm -f {} +

if [ $(find "$ROOT_DIR" -name '.cursorrules' | wc -l) -gt 1 ]; then
  echo "[ERROR] 檢查到多於一份 .cursorrules，請手動處理！" >&2
  exit 1
else
  echo ".cursorrules 唯一性檢查通過，只保留根目錄一份。"
fi 