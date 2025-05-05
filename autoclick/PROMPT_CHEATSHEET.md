# AutoClicker for macOS - 標準提示語清單（PROMPT_CHEATSHEET.md）

> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

> 本文件與 .cursorrules、CONTRIBUTING.md、STYLE_GUIDE.md、docs/PROJECT_PLAN_TODO.md 等規範文檔聯動，為團隊與 AI 助手提供標準提示語參考。所有任務分解、執行、驗收請以 docs/PROJECT_PLAN_TODO.md 為唯一來源。
> 📅 最後修改時間：2025-05-04 00:06

> 本文件用於指導團隊成員與 AI 助手如何根據專案規範進行 UI、邏輯、服務、測試、安全、上架等開發與驗證。每條提示語均明確標註規範檔案，便於自動化與標準化。
> 📅 最後修改時間：2025-05-04 00:06

---

## 📁 類別：UI 開發與元件建構

| 目的             | 標準提示語範例                                                                 |
|------------------|------------------------------------------------------------------------------|
| 建立主畫面 UI    | 根據 docs/UI_GUIDELINES.md 製作 MainView，需包含腳本清單、播放控制按鈕與狀態列 |
| 建立錄製器 UI    | 依照 docs/UI_GUIDELINES.md 設計 RecorderView，包含事件列表、延遲編輯與儲存按鈕 |
| 建立設定介面     | 根據 docs/SHORTCUTS.md 與 UI_GUIDELINES.md 製作 SettingsView，支援快捷鍵綁定與語言切換 |
| 建立腳本項目元件 | 製作 ScriptListItemView，顯示腳本名稱、次數與操作按鈕，符合 UI_GUIDELINES.md |

---

## 🧠 類別：ViewModel / 功能邏輯

| 目的                 | 標準提示語範例                                                                 |
|----------------------|------------------------------------------------------------------------------|
| 建立主畫面 ViewModel | 根據 docs/SPEC.md 與 QA_AUTOCHECK.md 實作 MainViewModel，負責腳本管理與狀態切換 |
| 建立錄製邏輯         | 請建立 RecorderViewModel，支援開始/停止錄製、管理 ScriptAction 陣列，資料格式請參考 DATA_SCHEMA.md |
| 處理快捷鍵邏輯       | 依照 docs/SHORTCUTS.md 製作 HotkeyManager 類別，可支援動態綁定、存取與觸發事件 |

---

## 📦 類別：Service / 儲存與讀寫邏輯

| 目的             | 標準提示語範例                                                                 |
|------------------|------------------------------------------------------------------------------|
| 儲存與讀取腳本   | 依 docs/DATA_SCHEMA.md 建立 ScriptStorageService，支援 save/load/delete JSON 檔案，儲存在 Application Support |
| 圖像識別處理邏輯 | 根據 docs/IMAGE_RECOGNITION_RULES.md 建立 ImageRecognitionService，支援模板比對、匹配與自動點擊 |
| 滑鼠鍵盤事件邏輯 | 實作 AccessibilityEventService，支援發送 CGEvent 模擬點擊與鍵盤輸入，須考慮 macOS 輔助功能權限 |

---

## 🧪 類別：自動化測試

| 目的                 | 標準提示語範例                                                                 |
|----------------------|------------------------------------------------------------------------------|
| 撰寫主畫面 UI 測試   | 根據 docs/UI_TESTS_PLAN.md 中 UI-001 至 UI-005 實作 MainView 的 UI 測試案例，使用 XCUITest |
| 撰寫快捷鍵測試       | 請測試 SettingsView 中快捷鍵輸入框是否正確綁定並立即反應，依照 UI_TESTS_PLAN.md 的 UI-010 至 UI-012 |
| 程式驗收規範檢查     | 請比對 docs/QA_AUTOCHECK.md，檢查這段代碼是否符合快捷鍵處理與圖像識別容錯的驗收要求 |

---

## 🔒 類別：安全與上架

| 目的                 | 標準提示語範例                                                                 |
|----------------------|------------------------------------------------------------------------------|
| 審核前隱私檢查       | 請比對 docs/SECURITY_POLICY.md 檢查本功能是否有違反沙盒限制或未授權資料存取行為 |
| App Store 上架說明生成 | 根據 docs/APPSTORE_NOTES.md 幫我產生隱私聲明與權限用途摘要，可放在 App Store Connect 的 App Review 說明欄位中 |

---

## 🎯 使用建議
- 每次提示都明確說出檔名（如 docs/UI_GUIDELINES.md）
- 用詞格式統一（「根據...」、「依照...」、「請比對...」）
- 如需連接多個規範檔，可用「與」或「、」連接明確說出來
- 鼓勵團隊與 AI 助手直接複製本清單作為日常開發、測試、驗收、上架的標準指令 

## 📁 目录结构与引用规范

### 1. 目录结构
- 所有文档必须放在 `docs/` 目录下
- 所有脚本必须放在 `scripts/` 目录下
- 所有代码必须放在 `AutoClicker/` 目录下
- 所有测试必须放在 `AutoClickerTests/` 目录下

### 2. 文件引用
- 文档引用必须使用 `docs/` 前缀
- 脚本引用必须使用完整路径
- 代码引用必须使用相对路径
- 禁止在根目录创建文档文件
- 禁止创建重复文件

### 3. 检查机制
- 每次提交前自动检查目录结构
- 检查文件引用路径
- 检查文档完整性
- 检查重复文件 