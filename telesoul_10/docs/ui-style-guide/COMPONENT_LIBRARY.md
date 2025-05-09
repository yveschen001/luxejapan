# COMPONENT_LIBRARY.md

| 元件名稱   | 用途      | 參數 & Props                                  | 範例 & 代碼片段                                |
| ------ | ------- | ------------------------------------------- | ---------------------------------------- |
| Button | 可點擊執行動作 | `label`, `onClick`, `variant`, `disabled`   | `<Button label="送禮" variant="primary"/>` |
| Input  | 輸入文字    | `value`, `placeholder`, `onChange`, `error` | `<Input placeholder="輸入訊息" error="必填"/>` |
| Card   | 展示內容容器  | `title`, `footer`, `children`               | `<Card title="排行榜">...</Card>`           |
| Modal  | 彈出層     | `isOpen`, `onClose`, `title`, `size`        | `<Modal isOpen title="登出確認">...</Modal>` |
| Avatar | 顯示用戶頭像  | `src`, `size`, `alt`                        | `<Avatar src="/user.png" size={40}/>`    | 