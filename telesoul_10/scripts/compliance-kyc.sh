#!/usr/bin/env bash
# TeleSoul KYC Compliance Script
# 參考: docs/ops/COMPLIANCE_GUIDELINES.md, playbook.yaml

USER_ID=$1
# 觸發清除
curl -s -X POST http://localhost:3000/api/admin/kyc/$USER_ID/purge
# 驗證無文件
resp=$(curl -s http://localhost:3000/api/admin/kyc/$USER_ID)
echo "$resp" | grep -q 'no records' 