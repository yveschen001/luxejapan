# TESTING_GUIDELINES.md

## 1. 測試層級與範圍

1. **單元測試 (Unit Tests)**
   * 測試對象：各服務方法、函式、Helper.
   * 框架：Jest / Mocha + Chai (Node.js)、pytest (Python).
   * 覆蓋範圍：Happy path、Error path、邊界條件.
2. **集成測試 (Integration Tests)**
   * 測試對象：不同服務間互動、資料庫連接.
   * 框架：Supertest (Node.js)、TestClient (FastAPI).
   * 環境：測試資料庫（Docker Compose）.
3. **契約測試 (Contract Tests)**
   * 測試對象：前後端接口一致性.
   * 框架：Pact.
   * 流程：Consumer 生成契約 → Provider 驗證契約.
4. **端到端測試 (E2E Tests)**
   * 測試對象：整體用戶流程（UI + API）.
   * 框架：Cypress / Playwright.
   * 場景：Bot 登錄 → Web 登錄 → 匹配 → 聊天 → 提領 → 報表.
5. **性能測試 (Performance Tests)**
   * 測試對象：關鍵 API、匹配服務.
   * 工具：k6、Locust.
   * 指標：P99 < 250ms、TPS、吞吐量.
6. **視覺回歸測試 (Visual Regression)**
   * 測試對象：Storybook 元件.
   * 工具：Chromatic / Percy.
7. **無障礙測試 (Accessibility Tests)**
   * 測試對象：UI 元件、頁面結構.
   * 工具：axe-core, Lighthouse.

## 2. 測試策略與管道

* **CI 集成**：在 GitHub Actions 中加入測試階段，分別執行 lint → 單元 → 集成 → 契約 → E2E → 性能 → 回歸 → 無障礙.
* **並行優先級**：單元最優先，E2E/性能可並行.
* **報告**：生成覆蓋率報告 (lcov)、性能報表、契約報告.

## 3. 測試數據與隔離

* **測試資料庫**：使用 Docker 啟動獨立資料庫，每次測試前清空.
* **Mock 與 Stub**：對第三方服務（KYC、Ton Connect、Firebase）使用 HTTP stub.

## 4. 測試熱點管理

* 定期審視覆蓋率 < 80% 的模組，補寫用例.
* 集成測試耗時過長者，拆分場景或優化.

## 5. 進度與質量門檻

* Pull Request 必須通過全部測試，覆蓋率不低於 80%.
* 重要核心模組（認證、計費、提領）覆蓋率需達 90%.

---

*End of TESTING_GUIDELINES.md* 