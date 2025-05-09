# CODE_STYLE_GUIDELINES.md

## 1. 檔案與目錄命名

* **微服務目錄**：`<service-name>-service`，全部小寫，以連字號分隔，例如 `auth-service`、`reporting-service`。
* **程式檔案**：使用小駝峰（camelCase）或全小寫加連字號（kebab-case），視語言慣例而定。
  * JavaScript/TypeScript：`userController.ts`、`billingService.ts`
  * Shell/配置：`deploy-local.sh`、`docker-compose.yaml`
* **測試檔案**：對應檔案後綴加 `.spec.ts` 或 `.test.ts`，如 `auth.service.spec.ts`。

## 2. 縮排與格式化

* 使用 **Prettier** 標準設定，行寬 100，單引號，末尾不加分號。
* JavaScript/TypeScript、JSON、Markdown 統一格式化，確保 CI 通過 `prettier --check`。

## 3. 變數、函式與類別命名

* **類別/介面**：PascalCase，例如 `UserService`, `MatchController`。
* **函式**：camelCase，動詞開頭，例如 `createUser()`, `getReportSummary()`。
* **常數**：全大寫加底線，例如 `MAX_RETRY`, `API_TIMEOUT_MS`。
* **檔案內部常量**：若僅此檔案使用可用 camelCase。

## 4. 註解與文檔

* **JSDoc / TSDoc**：所有公用函式、類別和接口都要加上 `/** ... */` 註解：

  ```ts
  /**
   * 取得當日報表快照
   * @param date YYYY-MM-DD
   * @returns DailySnapshot 物件
   */
  async function getDailySnapshot(date: string): Promise<DailySnapshot> { ... }
  ```
* **TODO / FIXME**：遇到暫緩或須重構的程式區塊，使用 `// TODO` 或 `// FIXME` 並加上 Issue ID。

## 5. 引用與路由標註

* **需求追溯**：在註解或 PR 提交訊息中標註需求文檔引用，例如 `ref: UI_DESIGN_GUIDELINES#按鈕設計` 或 `REQ-12`。
* **接口契約**：在 Controller 上方引用 OpenAPI 操作 ID：

  ```ts
  /**
   * @openapi
   * /api/metrics/daily:
   *   get:
   *     operationId: getDailyMetrics
   */
  ```

## 6. 例外與錯誤處理

* 統一使用自定義錯誤類別（如 `HttpError`），並儘量不要丟原生 `Error`。
* 在 catch 區塊內使用 logger 記錄錯誤訊息與呼叫堆疊。

## 7. 測試與覆蓋率

* **單元測試**：每個 function/class 至少一條 happy path 和一條 error path 測試。
* **集成測試**：用於跨模組交互，透過測試資料庫或 mock 對外依賴。
* **覆蓋率**：整體至少 80%，具體關鍵模組 90%。

## 8. Commit 與分支策略

* 使用 **Conventional Commits**：
  * feat: 新增功能
  * fix: 修復錯誤
  * docs: 文件更新
  * chore: 工具／構建調整
* 分支命名：`feature/<短描述>`、`bugfix/<短描述>`，例如 `feature/user-auth`

## 9. Lint 與靜態檢查

* **ESLint**：啟用 Airbnb 或專案自定義規範，禁止 `any`、禁止使用 `console.log`。
* CI 流程中加入 `eslint --max-warnings=0` 確保不留違規程式碼。

## 10. 安全與敏感資訊

* **環境變數**：所有憑證、API 金鑰、資料庫密碼絕不硬編碼，使用 `.env` 管理並加入 `.gitignore`。
* **依賴審核**：定期執行 `npm audit` 或 Snyk 檢查，並在 CI 報告。

---

*End of CODE_STYLE_GUIDELINES.md* 