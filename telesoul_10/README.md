# TeleSoul

[🏃‍♂️ Quickstart](./docs/QUICKSTART.md)

## 開發環境

- **必裝工具**：Node.js 18+、Docker、pnpm、Git、VSCode（建議安裝 Remote - Containers 擴展）
- **本地必備服務**：
  - PostgreSQL（主資料庫，對應所有後端微服務）
  - Redis（快取與任務隊列，對應 Match/Billing/Queue 等模組）
  - MinIO（對象儲存，對應用戶上傳、KYC、報表等模組）
- **一鍵開發環境**：
  1. 安裝 VSCode Remote - Containers
  2. 打開專案後選擇「Reopen in Container」
  3. 開始開發，所有腳本、測試、CI/CD 流程與本地一致
- **常用命令**：
  - `npm run lint` 代碼格式檢查
  - `npm test` 單元測試
  - `pnpm prisma migrate deploy` 數據庫遷移
  - `node scripts/run-playbook.js` 執行自動化 Playbook
  - `./scripts/start-containers.sh` 啟動所有 Docker 容器
  - `./scripts/check-containers.sh` 檢查容器健康狀態

## 環境變數配置

1. 複製模板：`cp .env.example .env`
2. 填寫真實值（參考各項註釋）。
3. **注意**：請勿提交 `.env` 文件！
4. 常見問題：
   - `DB_HOST` 連接失敗？請確認 Docker Compose 服務名。
   - `GCP_CREDENTIALS_JSON` JSON 格式報錯？請用雙引號 `\"...\"` 轉義。

## 一鍵啟動本地開發環境

- 推薦使用 `./dev-init.sh` 一鍵完成 Docker 檢查、容器啟動、依賴安裝、遷移、測試、合規、可觀測、清理等全流程。
- 詳細步驟與維護請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)
- 清理多餘 Docker 資源請執行 `./scripts/clean-docker.sh`
- FAQ、常見問題、維護流程請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)

## FAQ

- 如何新增環境變數？請先於 `.env.example` 補充，並同步文檔。
- CI/CD 失敗怎麼辦？請檢查環境變數與服務啟動狀態。
- 如何清理多餘 Docker image？請執行 `docker image prune -a`
- 監控告警如何設置？詳見 `OBSERVABILITY_GUIDELINES.md`。
- 如何進行專案維護與自動化自審？詳見 `MAINTENANCE_GUIDELINES.md`。
- 如何自動修復常見錯誤？詳見 `MAINTENANCE_GUIDELINES.md`。
- 本地啟動前，請先驗證 Docker：`./scripts/check-docker.sh`，所有端口配置請統一於 .env.example
- 如何檢查本地 Docker 環境？請執行 `./scripts/check-docker.sh`，詳見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)
- Docker 開發環境配置詳見 [DOCKER_DEVELOPMENT_GUIDELINES.md](./docs/dev/DOCKER_DEVELOPMENT_GUIDELINES.md)
- **如有 Ansible Playbook，請優先使用 `ansible-playbook playbook.yaml` 進行全自動化流程。**

## 其他內容

- 所有 DB/Redis/MinIO 相關文檔、腳本、compose 均已交叉引用於本文件、MAINTENANCE_GUIDELINES.md、DOCKER_DEVELOPMENT_GUIDELINES.md
- 自動修復規範請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)
- **目錄結構補充**
  - `ansible/`：預留 Ansible Playbook、roles、inventory、group_vars 等自動化資產，詳見 DOCUMENTATION_GUIDELINES.md 