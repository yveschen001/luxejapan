#!/usr/bin/env bash
# 用途: 執行性能壓測，覆蓋關鍵 API/服務
# 參考: docs/dev/TESTING_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

if command -v k6 >/dev/null 2>&1; then
  echo "[INFO] 執行 k6 性能壓測..."
  k6 run tests/perf/main.js
elif command -v locust >/dev/null 2>&1; then
  echo "[INFO] 執行 Locust 性能壓測..."
  locust -f tests/perf/locustfile.py
else
  echo "[ERROR] 未安裝 k6 或 Locust，請先安裝依賴。"
  exit 1
fi 