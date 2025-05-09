# AUTO_FIX_GUIDELINES.md

## 1. 自動修復目標

* 在開發流程中發現常見錯誤時（lint、格式、測試失敗），Cursor 可自動嘗試修復。
* 修復後需重新執行測試或檢查，確保問題已解決。

## 2. 修復範疇

1. **格式化與 Lint 修復**
   * 使用 Prettier 自動修正格式問題：`prettier --write`.
   * 使用 ESLint 自動修復簡單規則：`eslint --fix`.
2. **依賴與安全**
   * 當 `npm audit` 報告高危漏洞，嘗試自動升級：`npm audit fix`.
3. **測試錯誤**
   * 若測試指出拼寫錯誤或小範圍代碼錯誤，Cursor 分析錯誤訊息並嘗試簡單修復：
     * API 路由不符 → 根據 API Spec 更新路由定義.
     * 參數名稱拼寫錯誤 → 根據測試與介面自動更正.
4. **配置問題**
   * Docker Compose 啟動失敗 → 檢查端口衝突與環境變數是否齊全，自動補充或提醒.

## 3. 修復流程

1. **偵測錯誤**：Monitor 任務的 `check_command` 輸出與 exit code.
2. **分類錯誤**：根據關鍵字（e.g., "ESLint", "Prettier", "TypeError", "Cannot GET /api"）判定修復類型.
3. **執行修復**：呼叫對應工具或程式補丁腳本.
4. **再次驗證**：重複 `check_command`，若成功則標記完成，否則進入下一輪重試.
5. **重試上限**：每項任務最多自動修復 3 次，超限後暫停並記錄詳情.

## 4. 實作示例

```bash
# 自動格式化
prettier --write "src/**/*.{ts,js,json,md}"
# 自動修復 ESLint
eslint "src/**/*.{ts,js}" --fix
# 測試錯誤修復
node scripts/auto-fix-api-routes.js --spec docs/api-spec/openapi.yaml
```

## 5. 日誌與通知

* 所有自動修復操作均記錄至 `logs/auto-fix.log`.
* 若修復次數超限，發送 Slack 通知至 #dev-alerts 頻道.

## 6. 限制與人工介入

* 並非所有錯誤都能自動修復；對複雜邏輯錯誤或第三方依賴衝突，Cursor 需立即掛起並報告.
* 自動修復成功後，Pull Request 提交自動修復補丁，並 @team-review 提示手動審查.

---

*End of AUTO_FIX_GUIDELINES.md* 