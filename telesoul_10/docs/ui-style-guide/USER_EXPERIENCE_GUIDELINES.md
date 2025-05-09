# USER_EXPERIENCE_GUIDELINES.md

## 用戶流程與導航

* **入口**: 明確「開始配對」、「聊天室」、「個人中心」主導航。
* **導航層級**: 最多兩層，側欄與頂欄結合 Breadcrumb。
* **上一步/下一步**: 在多步驟流程中保持顯眼按鈕。

## 錯誤處理與提示

* **即時提示**: 輸入錯誤時底部紅色文字，不跳出彈窗。
* **全局錯誤**: Toast 通知置頂 3s，自動消失，可重試。

## 加載狀態與反饋

* 使用 Skeleton Loading 模式，減少用戶等待焦慮。
* 長操作 (>2s) 顯示進度條或 Loading Spinner。

## 表單設計與驗證

* 實時驗證：用戶輸入即時標示正確/錯誤。
* Validation Message 清晰：具體問題+建議操作。

## 多語言支持與國際化

* 使用 i18n 框架（如 ngx-translate、react-i18next）。
* 文案放在外部 JSON 文件，避免硬編碼。
* 詳細規範請參見 [INTERNATIONALIZATION_GUIDELINES.md](../INTERNATIONALIZATION_GUIDELINES.md)

## 用戶測試與反饋收集

* 整合 Hotjar / Mixpanel 錄屏與熱圖分析。
* 彈出簡短滿意度調查（5 分制）以收集使用感。

如需國際化流程、測試、翻譯管理等，請詳見 [INTERNATIONALIZATION_GUIDELINES.md](../INTERNATIONALIZATION_GUIDELINES.md) 