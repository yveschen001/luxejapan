# Luxe Japan Elite Escorts 開發規範索引（cursorrule）

## 1. 目錄與結構
- 嚴格遵循標準目錄結構（src/components, src/pages, src/i18n, src/config, public/images 等）
- 靜態資源統一放於 public/images，不允許隨意更動目錄

## 2. 國際化（i18n）
- 所有用戶可見文案、alt、SEO meta、結構化數據均必須多語言化
- 語言包統一放於 src/i18n，新增文案必須同步所有語言
- 圖片 alt 必須用 $t() 取值，不可硬編碼

## 3. SEO 最佳化
- 每頁必須有唯一且多語言的 <title>、<meta name="description">、Open Graph、Twitter Card
- hreflang、canonical 必須自動生成，指向所有語言版本
- 結構化數據（JSON-LD）內容必須多語言
- 圖片必須設置 loading="lazy"、width、height、alt
- 站內鏈接必須用 localePath 工具生成，禁止硬編碼

## 4. 聯繫方式與社交媒體
- 所有聯繫方式、社交媒體鏈接統一抽離至 src/config/contacts.js
- 頁面與組件引用 contacts.js，不可硬編碼

## 5. 流量監測與第三方服務
- Google Analytics、Firebase 等所有第三方配置統一抽離至 src/config/analytics.js
- 代碼中引用 analytics.js，不可硬編碼

## 6. 全局組件與品牌規範
- BrandLogo、SectionContainer 等全局組件受保護，需 PR 審核
- "Luxe Japan" 品牌字樣必須用 <BrandLogo />，禁止寫死

## 7. 代碼規範
- HTML 使用語義化標籤
- CSS 採用 BEM 命名、CSS 變數、移動優先
- JS 採用 ES6+，保持簡潔，適當註釋
- 文件命名、變數命名、組件命名嚴格遵循 requirements.md

## 8. 測試與 CI
- 新功能必須有測試用例，E2E 覆蓋語言切換、導航、表單等
- PR 流程集成自動化 SEO/Lighthouse 檢查，分數需≥90

## 9. 內容與鏈接
- 新增/修改內容必須同步所有語言
- 站內鏈接多語言自動生成，嚴禁硬編碼

## 10. 其他
- 隱私政策、服務條款等法規頁面必須完善
- 團隊成員必須閱讀並遵守本規範及 docs/CONTRIBUTING.md 