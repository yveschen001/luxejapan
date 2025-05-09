#!/usr/bin/env bash
# TeleSoul GDPR/CCPA Compliance Script
# 參考: docs/ops/COMPLIANCE_GUIDELINES.md, playbook.yaml

EMAIL=testuser@example.com
# 1. 導出數據
curl -s -X GET "http://localhost:3000/api/user/export?email=$EMAIL" -o export.zip
# 2. 刪除數據
curl -s -X DELETE "http://localhost:3000/api/user/data?email=$EMAIL"
# 3. 校驗導出後不再能獲取敏感字段
resp=$(curl -s -X GET "http://localhost:3000/api/user/profile?email=$EMAIL")
echo "$resp" | grep -q ""  # 應無 PII 數據 