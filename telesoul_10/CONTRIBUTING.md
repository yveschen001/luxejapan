# 貢獻指南（CONTRIBUTING）

歡迎參與 TeleSoul 專案！請遵循以下規範：

## Issue 與 PR 流程
- 請先於 Issue 討論需求或問題，獲得認可後再開發。
- PR 必須關聯對應 Issue，並清楚描述變更內容。
- 重大變更需經資深工程師審查。

## 分支命名規則
- `feature/xxx` 新功能
- `fix/xxx` 修復
- `chore/xxx` 工具/依賴/配置

## Commit message 規範
- 採用 Conventional Commits 格式：
  - `feat: 新增...`
  - `fix: 修復...`
  - `docs: 文檔...`
  - `test: 測試...`
  - `chore: ...`

## 代碼審查
- 每次 PR 需至少一位資深工程師審查通過。
- 需通過自動化 Lint、Test、Build、Docs 檢查。

## 代碼風格
- 請參見 [CODE_STYLE_GUIDELINES.md](./docs/CODE_STYLE_GUIDELINES.md)
- 格式化：prettier、eslint --fix

## 測試覆蓋
- 單元測試覆蓋率需 ≥80%
- 重要功能需有集成/E2E 測試

## 回滾流程
- 發現嚴重問題請立即 revert PR，並於 Issue 跟進

## 本地運行 Playbook
- `node scripts/run-playbook.js` 或參見 [playbook.yaml](./playbook.yaml)

## 本地開發環境
- 本專案本地開發必須啟動 PostgreSQL、Redis、MinIO，所有服務皆由 docker-compose.yml 管理。
- 開發前請先執行 `./scripts/check-docker.sh` 及 `./scripts/check-docker-services.sh` 驗證 Docker 環境、端口與所有服務狀態。
- Docker 開發環境配置詳見 [DOCKER_DEVELOPMENT_GUIDELINES.md](./docs/dev/DOCKER_DEVELOPMENT_GUIDELINES.md)
- 一鍵啟動所有服務：`./scripts/start-containers.sh`
- 檢查服務健康狀態：`./scripts/check-containers.sh`

## 一鍵啟動流程
- 推薦使用 `./dev-init.sh` 一鍵完成本地開發全流程，詳見 README.md、MAINTENANCE_GUIDELINES.md
- 清理多餘 Docker 資源請執行 `./scripts/clean-docker.sh`

## FAQ
- 如何排查 Docker 服務啟動異常？請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)
- 如何清理多餘 Docker image？請執行 `docker image prune -a`，或參見 README.md
- 其他常見問題請參見 [README.md](./README.md)
- **如有 Ansible Playbook，請優先使用 `ansible-playbook playbook.yaml` 進行全自動化流程。**

## 腳本註釋規範
- 所有自動化腳本必須包含標準註釋（用途、參考、負責人），詳見 [DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md)

## 最高規範依據
- 本文件及所有開發規範均需遵循 [.cursorrules](./.cursorrules)

## 其他
- 詳細開發規範請參見 [DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md)

## 維護與自動化自審
- 詳細維護規範與自動化自審請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)
- 自動修復規範請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)
- 如何檢查本地 Docker 服務？請執行 `./scripts/check-docker-services.sh`，詳見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)

## 注意事項
- 腳本只做檢查，不會自動啟動 Docker 或修復端口衝突（如需自動修復可結合 auto-fix-ports.sh）。
- 端口配置必須與 `.env.example` 保持同步，否則檢查可能遺漏。

## 結論
- 這兩個腳本完全可以作為 TeleSoul 專案 Docker 環境的標準自檢工具，建議每次開發/部署前都先執行一次。

如需進一步自動啟動 Docker Compose 或自動修復端口，請告知，我可為您擴展腳本！

## 進階自動化腳本（推薦）

如果您希望自動化檢查**所有應該啟動的服務**（如 docker-compose.yml 中定義的服務），可以在 `scripts/check-docker.sh` 之後，新增一個腳本 `scripts/check-docker-services.sh`，如下：

```bash
#!/usr/bin/env bash
# 用途: 檢查 docker-compose.yml 中所有服務是否已啟動
# 參考: MAINTENANCE_GUIDELINES.md, DOCUMENTATION_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]    $1"; }
error() { echo "[ERROR]   $1" >&2; }

if [ ! -f docker-compose.yml ]; then
  error "未找到 docker-compose.yml，請在專案根目錄執行。"
  exit 1
fi

expected_services=$(docker compose config --services)
running_services=$(docker compose ps --services --filter "status=running")

missing=()
for svc in $expected_services; do
  if ! echo "$running_services" | grep -q "^$svc$"; then
    missing+=("$svc")
  fi
done

if [ ${#missing[@]} -eq 0 ]; then
  log "所有 docker-compose 服務均已啟動"
  exit 0
else
  error "以下服務未啟動: ${missing[*]}"
  exit 1
fi
```

---

### 使用方式

1. **賦予執行權限**
   ```bash
   chmod +x scripts/check-docker-services.sh
   ```

2. **執行檢查**
   ```bash
   ./scripts/check-docker-services.sh
   ```

3. **結果說明**
   - 若所有服務都在運行，會輸出 `[INFO] 所有 docker-compose 服務均已啟動`
   - 若有服務未啟動，會列出未啟動的服務名稱

---

### 補充

- 若您有多個 compose 檔案（如 docker-compose.override.yml），可在腳本中加上 `-f` 參數。
- 若要自動啟動所有服務，可在腳本中加 `docker compose up -d`。

---

**結論：**
- 用 `docker ps` 可快速檢查所有運行中的容器。
- 用上述腳本可自動比對 docker-compose.yml 內所有服務是否都已啟動，並明確提示缺失服務。

如需我自動生成 `check-docker-services.sh` 並補全文檔引用，請告知！

docker rmi minio/mc:latest jaegertrac:latest dpage/pg:latest adminer:latest 

## 目錄結構補充
- `ansible/`：預留 Ansible Playbook、roles、inventory、group_vars 等自動化資產，詳見 DOCUMENTATION_GUIDELINES.md 

## 環境變數補充
- 請確保 `.env` 或 `.env.example` 內有所有必需的環境變數（可參考 docs/dev/ENVIRONMENT_VARIABLE_GUIDELINES.md）。
- 例如：
  ```
  DB_USER=postgres
  DB_PASS=changeme
  DB_NAME=telesoul_dev
  JWT_SECRET=your_jwt_secret
  TELEGRAM_BOT_TOKEN=your_telegram_token
  FIREBASE_PROJECT_ID=your_firebase_project
  TON_NETWORK=testnet
  ``` 