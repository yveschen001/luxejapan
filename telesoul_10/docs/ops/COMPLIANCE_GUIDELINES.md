# COMPLIANCE_GUIDELINES.md

## 1. 目的

確保 TeleSoul 平台在合規（GDPR/CCPA、KYC）方面具備自動化自測能力，通過 Playbook 一鍵執行並驗證關鍵隱私與數據保留策略。

## 2. GDPR/CCPA 數據刪除自測

### 2.1 接口與腳本

* **用戶導出**：`GET /user/export` → 生成包含個人資料、聊天摘要、交易記錄的 ZIP 包。
* **用戶刪除**：`DELETE /user/data` → 刪除或脫敏用戶所有 PII 數據。
* **腳本**：`scripts/compliance-gdpr.sh`：

  ```bash
  #!/usr/bin/env bash
  EMAIL=testuser@example.com
  # 1. 導出數據
  curl -s -X GET "http://localhost:3000/api/user/export?email=$EMAIL" -o export.zip
  # 2. 刪除數據
  curl -s -X DELETE "http://localhost:3000/api/user/data?email=$EMAIL"
  # 3. 校驗導出後不再能獲取敏感字段
  resp=$(curl -s -X GET "http://localhost:3000/api/user/profile?email=$EMAIL")
  echo "$resp" | grep -q ""  # 應無 PII 數據
  ```

### 2.2 Playbook 任務示例

```yaml
- id: compliance_gdpr
  name: GDPR/CCPA 自測
  description: 執行用戶導出與刪除腳本，並驗證 PII 數據已清除
  command: scripts/compliance-gdpr.sh
  check_command: test $? -eq 0
  deps: [health_all, deploy_local]
  retries: 1
```

## 3. KYC 數據保留與清除

### 3.1 規則與策略

* **保留週期**：KYC 文件與結果保留 180 天；到期自動脫敏或刪除。
* **接口**：

  * 查詢：`GET /admin/kyc/:userId`
  * 清除：`POST /admin/kyc/:userId/purge`

### 3.2 腳本示例

`scripts/compliance-kyc.sh`：

```bash
#!/usr/bin/env bash
USER_ID=$1
# 觸發清除
curl -s -X POST http://localhost:3000/api/admin/kyc/$USER_ID/purge
# 驗證無文件
resp=$(curl -s http://localhost:3000/api/admin/kyc/$USER_ID)
echo "$resp" | grep -q 'no records'
```

### 3.3 Playbook 任務示例

```yaml
- id: compliance_kyc
  name: KYC 數據清除自測
  description: 執行 KYC 清除腳本並驗證記錄已刪除
  command: scripts/compliance-kyc.sh 12345
  check_command: test $? -eq 0
  deps: [compliance_gdpr]
  retries: 1
```

## 4. 報告與審計

* **演練報告**：每次自測完成後生成 `docs/sop/compliance-report-<timestamp>.md`
* **審計日誌**：自測操作寫入 `compliance_audit_logs` 表，記錄操作人、時間、結果。
* **通知**：失敗時通知到 Slack `#compliance-alerts` 頻道。

---

*End of COMPLIANCE_GUIDELINES.md* 