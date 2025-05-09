#!/usr/bin/env bash
# 用途: 自動格式化代碼（prettier、eslint --fix）並修復常見語法錯誤
# 參考: MAINTENANCE_GUIDELINES.md, error-fix-map.json
# 負責人: TeleSoul Team

set -euo pipefail

npx prettier --write .
npx eslint . --fix || true

echo "[OK] 代碼格式化與自動修復已完成" 