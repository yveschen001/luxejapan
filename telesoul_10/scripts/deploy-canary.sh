#!/usr/bin/env bash
# TeleSoul Canary Deploy Script
# 參考: docs/ops/CI_CD_GUIDELINES.md, playbook.yaml
# 用於金絲雀部署（Cloud Run/ArgoCD）

set -e

SERVICE_NAME=${SERVICE_NAME:-my-service}
IMAGE_TAG=${IMAGE_TAG:-latest}
CANARY_PERCENT=${CANARY_PERCENT:-10}

# 部署金絲雀版本
# 這裡以 Cloud Run 為例，請根據實際情況調整

gcloud run deploy $SERVICE_NAME \
  --image=gcr.io/$PROJECT_ID/$SERVICE_NAME:$IMAGE_TAG \
  --region=$REGION \
  --platform=managed \
  --traffic $CANARY_PERCENT

echo "Canary deployment triggered for $SERVICE_NAME with $CANARY_PERCENT% traffic." 