# QUICKSTART.md

快速上手指南：在一行命令中完成環境啟動、自動化流程執行及服務訪問。

## 前置條件

* 已安裝 Docker & Docker Compose
* 已安裝 Node.js (>=16) 與 pnpm/yarn
* 已安裝 Python 3.9+ (如使用 FastAPI)
* 專案根目錄包含：

  * `playbook.yaml` 與 `.cursor-todo.yaml`
  * `scripts/` 下各類腳本 (setup.sh, run-playbook.js, deploy-local.sh 等)
  * `.env.local` 或從 CI 注入的環境變數

## 一鍵啟動命令

```bash
# 在專案根目錄執行：
./scripts/setup.sh && \
node scripts/run-playbook.js playbook.yaml --env local && \
bash scripts/deploy-local.sh && \
echo "
🚀 TeleSoul 服務已啟動：
  - 前端: http://localhost:3000
  - 管理後台: http://localhost:3001
  - 後端健康: http://localhost:4000/health
  - Jaeger: http://localhost:16686
  - Kibana: http://localhost:5601
"
```

## 各步驟說明

1. **setup.sh**：啟動 Postgres、Redis、MinIO 容器，安裝依賴，執行資料庫遷移。
2. **run-playbook.js**：按 `playbook.yaml` 與 `.cursor-todo.yaml` 自動化執行開發、測試、合規、可觀測等任務。
3. **deploy-local.sh**：將所有服務容器化並在本地啟動，進行端到端健康檢查。
4. **輸出服務入口**：列出所有核心服務地址，方便瀏覽器或 Postman 訪問。

## 常用命令

* `npm run test` / `pytest`：運行所有單元與集成測試
* `npm run lint`：代碼風格檢查
* `npm run storybook`：啟動 UI 元件庫預覽
* `node scripts/metrics-healthcheck.js`：驗證核心業務指標

---

*End of QUICKSTART.md* 