# INTERNATIONALIZATION_GUIDELINES.md

## 1. 目的

規範 TeleSoul 平台多語言支持（i18n）與本地化（l10n）流程，確保用戶界面在不同語言與地區環境下都具有一致、準確且易用的體驗。

## 2. 目錄結構與文件命名

```
src/
└── locales/
    ├── en.json         # 英語（默認）
    ├── zh-TW.json      # 繁體中文
    ├── zh-CN.json      # 簡體中文
    ├── ja.json         # 日語
    └── fr.json         # 法語
```

* 使用 [BCP 47](https://tools.ietf.org/html/bcp47) 規範命名語言與區域代碼。
* 每個 JSON 文件為平鋪結構，鍵命名使用 `dot.notation`，如：

  ```json
  {
    "login.title": "Welcome",
    "login.button.submit": "Sign In"
  }
  ```

## 3. 鍵命名與作用域

* **命名規範**：`<頁面>.<組件>.<功能>`，全小寫，使用點號分層。
* **避免重複**：相同文案只使用一個 key，複用型文本提取到公共命名空間，如 `common.ok`, `common.cancel`。

## 4. 插值與複數化

* **插值佔位符**：使用`${variable}`，如：

  ```json
  "notifications.count": "You have ${count} new notifications"
  ```
* **複數化**：遵循 ICU MessageFormat，示例：

  ```json
  "cart.items": "{count, plural, =0 {No items} one {1 item} other {{count} items}}"
  ```

## 5. 動態加載與按需加載

* 在前端路由或組件中根據用戶 `locale` 動態加載對應語言包，以減少首次打包體積。
* 示例（React + react-i18next）：

  ```js
  import i18n from 'i18next';
  import { initReactI18next } from 'react-i18next';

  i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    supportedLngs: ['en','zh-TW','zh-CN','ja','fr'],
    backend: {
      loadPath: '/locales/{{lng}}.json'
    }
  });
  ```

## 6. 翻譯流程與工具

1. **主流程**：設計→提取文字→生成翻譯模板(`.pot`/`.json`)→翻譯→校對→合併。
2. **譯文管理**：可使用 Locize、Crowdin 或 Weblate 管理翻譯版本與審核。
3. **CI 校驗**：在 CI/CD 中加入腳本 `npm run i18n:validate`，檢查：

   * 翻譯 key 漏缺
   * 佔位符格式一致
   * JSON 語法合法

## 7. 多語言 UX 考量

* **語言切換入口**：在 Header 或個人中心提供顯眼的語言下拉菜單。
* **日期/數字/貨幣格式**：使用 `Intl.DateTimeFormat`、`Intl.NumberFormat` 根據 `locale` 格式化。
* **文本方向**：支持 RTL 語言（如阿拉伯語、希伯來語），在 `<html lang>` 和 `dir` 屬性中正確設置方向。

## 8. 本地化圖片與資源

* 針對不同區域文化，提供本地化的圖片、格式，例如在中國地區使用符合本地審美的插圖。
* 將資源放在 `public/locales/{{lng}}/images/` 中，根據 `locale` 路徑加載。

## 9. 測試與監控

* **功能測試**：E2E 腳本中按不同 `locale` 驗證主要頁面 UI 文案是否正確渲染。
* **偽翻譯**：使用 pseudo-locale（如 `fr-CA-x-pseudo`）測試字符延展、換行、RTL 排版。
* **缺失提醒**：在開發環境中，如訪問不存在的 key，拋出警告並高亮顯示。

## 10. 文檔與可追溯性

* 將所有 i18n 相關規範與流程集成到 `docs/` 中，並在 `README.md` 添加鏈接：

  ```markdown
  ## 本地化指南
  請參考 [INTERNATIONALIZATION_GUIDELINES.md](docs/ui/INTERNATIONALIZATION_GUIDELINES.md)
  ```

---

*End of INTERNATIONALIZATION_GUIDELINES.md* 