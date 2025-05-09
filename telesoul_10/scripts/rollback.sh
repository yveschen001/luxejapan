#!/usr/bin/env bash
# TeleSoul Rollback Script
# 參考: docs/ops/CI_CD_GUIDELINES.md, playbook.yaml
# 用於自動回滾到上一個穩定版本

set -e

SERVICE_NAME=${SERVICE_NAME:-my-service}
REGION=${REGION:-us-central1}

# 查找上一個成功的 revision
LAST_GOOD_REVISION=$(gcloud run revisions list --service $SERVICE_NAME --region $REGION --sort-by=~CREATED --format='value(METADATA.name)' | sed -n 2p)

if [ -z "$LAST_GOOD_REVISION" ]; then
  echo "找不到上一個成功的 revision，請手動處理。" >&2
  exit 1
fi

gcloud run services update-traffic $SERVICE_NAME --to-revisions $LAST_GOOD_REVISION=100 --region $REGION

echo "Rollback to $LAST_GOOD_REVISION completed." 