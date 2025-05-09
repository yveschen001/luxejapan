#!/usr/bin/env bash
# 用途: 執行 API 合約測試，驗證前後端接口一致性
# 參考: docs/dev/TESTING_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

if [ -f ./node_modules/.bin/pact ]; then
  echo "[INFO] 執行 Pact 合約測試..."
  npx pact verify
elif [ -f ./node_modules/.bin/swagger-cli ]; then
  echo "[INFO] 執行 Swagger/OpenAPI 合約驗證..."
  npx swagger-cli validate docs/api-spec/openapi.yaml
else
  echo "[ERROR] 未安裝 Pact 或 swagger-cli，請先安裝依賴。"
  exit 1
fi 