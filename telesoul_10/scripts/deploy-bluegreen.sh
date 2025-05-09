#!/usr/bin/env bash
# TeleSoul Blue-Green Deploy Script
# 參考: docs/ops/CI_CD_GUIDELINES.md, playbook.yaml
# 用於藍綠部署（Cloud Run/ArgoCD）

set -e

SERVICE_NAME=${SERVICE_NAME:-my-service}
IMAGE_TAG=${IMAGE_TAG:-latest}
REGION=${REGION:-us-central1}

# 部署 Green 環境
# 這裡以 Cloud Run 為例，請根據實際情況調整

gcloud run deploy $SERVICE_NAME-green \
  --image=gcr.io/$PROJECT_ID/$SERVICE_NAME:$IMAGE_TAG \
  --region=$REGION \
  --platform=managed

echo "Green environment deployed. 請驗證健康狀態後切流量。"

# 切流量到 Green
# gcloud run services update-traffic $SERVICE_NAME --to-revisions $SERVICE_NAME-green=100 