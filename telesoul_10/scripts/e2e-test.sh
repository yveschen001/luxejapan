#!/usr/bin/env bash
# 用途: 執行端到端（E2E）測試，覆蓋主要用戶流程
# 參考: docs/dev/TESTING_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

if [ -f ./node_modules/.bin/playwright ]; then
  echo "[INFO] 執行 Playwright E2E 測試..."
  npx playwright install
  npx playwright test
elif [ -f ./node_modules/.bin/cypress ]; then
  echo "[INFO] 執行 Cypress E2E 測試..."
  npx cypress run
else
  echo "[ERROR] 未安裝 Playwright 或 Cypress，請先安裝依賴。"
  exit 1
fi 