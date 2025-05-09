#!/usr/bin/env bash
# 用途: 校驗 docs/、scripts/、playbook.yaml 交叉引用與一致性
# 參考: MAINTENANCE_GUIDELINES.md, DOCUMENTATION_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

missing=()
for script in scripts/*.sh scripts/*.js; do
  name=$(basename "$script")
  if ! grep -qr "$name" docs/ && ! grep -q "$name" playbook.yaml; then
    echo "[WARN] $name 未在 docs/ 或 playbook.yaml 中引用"
    missing+=("$name")
  fi
done
if [ ${#missing[@]} -eq 0 ]; then
  echo "[INFO] 所有腳本均有文檔或 playbook 交叉引用"
else
  echo "[ERROR] 以下腳本缺少文檔或 playbook 交叉引用: ${missing[*]}"
  exit 1
fi 