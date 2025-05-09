# MAINTENANCE_GUIDELINES.md

## 1. .env.example 同步校驗

* 項目根目錄必須包含 `.env.example`，內容與 `docs/dev/ENVIRONMENT_VARIABLE_GUIDELINES.md` 一致，並隨文檔更新同步。
* 自動化：`scripts/check-env-example.sh` 比對 `.env.example` 與文檔/程式碼引用，提醒缺失或多餘。

## 2. FAQ 與文檔交叉鏈接

* `README.md`、`DOCUMENTATION_GUIDELINES.md`、`docs/quickstart/QUICKSTART.md` FAQ 補充常見問題並鏈接：
  * 合規自測 → `COMPLIANCE_GUIDELINES.md`
  * 回滾策略 → `CI_CD_GUIDELINES.md`
  * 監控告警 → `OBSERVABILITY_GUIDELINES.md`
* 自動化：`scripts/check-faq-links.sh` 檢查 FAQ 是否包含上述鏈接。

## 3. 腳本頭部註釋與引用

* 所有 `scripts/*.sh/js` 文件頭部需包含：
  ```bash
  #!/usr/bin/env bash
  # 用途: <簡述>
  # 參考: <相關文檔路徑>
  # 负责人: <姓名/團隊>
  ```
* 自動化：`scripts/check-script-headers.sh` 驗證所有腳本前 N 行包含 "用途:" 和 "參考:"。

## 4. Playbook 與 .cursor-todo.yaml 同步

* 確保所有自動化腳本均已在 `playbook.yaml` 或 `.cursor-todo.yaml` 註冊為任務。
* 自動化：`scripts/check-todo-sync.sh` 對比 `scripts/` 目錄與 `.cursor-todo.yaml`，列出未註冊腳本。

## 5. Prometheus 告警規則校驗

* `infra/terraform/modules/prometheus/alerts.yaml` 必須包含 HighRequestLatency、HighErrorRate、HighMemoryUsage 等關鍵規則。
* 自動化：`scripts/check-prometheus-alerts.sh` 校驗規則文件是否存在並包含上述 alert 名稱。

## 6. CHANGELOG.md 維護

* 每次重大變更（文檔、腳本、Playbook）後更新 `CHANGELOG.md`。
* 自動化：`scripts/check-changelog.sh` 檢查最近 commit 是否同步更新 CHANGELOG.md。

## 7. 測試覆蓋率自動校驗

* CI/CD pipeline 強制 `--coverageThreshold` ≥ 80%。

## 8. 監控告警通知

* 所有監控/健康/性能腳本失敗時應自動發送 Slack 通知。
* 自動化：腳本內嵌入 notify_slack 函數，並於失敗時調用。

## 9. 文檔與腳本自審腳本

* 新增 `scripts/check-cross-references.sh`，對 `docs/`、`scripts/`、`playbook.yaml` 進行交叉檢查，確保引用一致。
* 自動化：定期在 CI 中運行，生成報告。

## 10. 自動修復（Auto Fix）

* 錯誤-補丁映射：維護 `error-fix-map.json`，收錄常見錯誤與對應自動修復腳本（如 auto-fix-format.sh、auto-fix-ports.sh、auto-fix-db-retry.sh）。
* Runner 集成：在 `run-playbook.js` 失敗時自動查表並執行修復腳本，然後重試。
* 腳本規範：所有 auto-fix-*.sh 腳本需有標準註釋與用途說明。
* 文檔引用：本章節被引用於 `.cursorrules`、`CONTRIBUTING.md`、`DOCUMENTATION_GUIDELINES.md`、`README.md`、`product-requirements.md`。
* 參考實現：見下方 run-playbook.js 片段。

## 11. Docker 環境自檢與端口配置一致性

* 所有常用端口（如 PORT、DB_PORT、REDIS_PORT、MINIO_PORT 等）必須統一配置於 .env.example，並被 `scripts/check-docker.sh` 檢查。
* Docker 環境自檢腳本請參見 `scripts/check-docker.sh`，相關規範請參見本文件與 DOCUMENTATION_GUIDELINES.md。
* 任何端口變更，請同步更新 .env.example、docker-compose.yml、check-docker.sh 及相關文檔。
* **本專案必備服務：PostgreSQL（主資料庫）、Redis（快取/隊列）、MinIO（對象儲存），所有開發/測試/部署環境必須啟動並健康檢查。**

## 一鍵啟動與清理腳本
- 推薦使用 `./dev-init.sh` 一鍵完成本地開發全流程，詳見 README.md
- 清理多餘 Docker 資源請執行 `./scripts/clean-docker.sh`

## FAQ
- 如何一鍵啟動本地開發？請執行 `./dev-init.sh`，詳見 README.md
- 如何清理多餘 Docker image？請執行 `./scripts/clean-docker.sh`，詳見 README.md
- **如有 Ansible Playbook，請優先使用 `ansible-playbook playbook.yaml` 進行全自動化流程。**

## 腳本註釋範例
```bash
#!/usr/bin/env bash
# 用途: 檢查 Redis 連線與自動修復
# 參考: MAINTENANCE_GUIDELINES.md, error-fix-map.json
# 負責人: TeleSoul Team
```

## 目錄結構補充
- `ansible/`：預留 Ansible Playbook、roles、inventory、group_vars 等自動化資產，詳見 DOCUMENTATION_GUIDELINES.md

---

*End of MAINTENANCE_GUIDELINES.md* 