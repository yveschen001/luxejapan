# UI_DESIGN_GUIDELINES.md

## 色彩方案與主題

* **主色（Primary）**: 深紫 (`#4B0082`)、金色 (`#FFD700`)，傳達高級感與活力。
* **輔助色（Secondary）**: 淺紫 (`#9370DB`)、淡金 (`#FFECB3`)，用於強調按鈕、連結。
* **中性色（Neutral）**: 白 (`#FFFFFF`)、淺灰 (`#F5F5F5`)、深灰 (`#333333`)。
* **警示色**: 紅 (`#E53935`)、綠 (`#43A047`) 用於錯誤／成功提示。

## 字體與排版

* **字體**: 主體使用「Inter」或「Noto Sans」; 標題使用「Poppins Bold」。
* **字重**: 標題 H1–H6 分別對應 700 / 600 / 500, 正文字重 400。
* **行高與間距**: 行高 1.5，段落間距 1rem。
* **響應式文字**: 根據視窗尺寸調整根字體（`html { font-size: 100%; } @media`）。

## 元件設計規範

* **按鈕 (Button)**

  * 高度: 40px / 48px (大)
  * 邊框圓角: 8px
  * 懸停 / 點擊: 色彩變淺 10%, 陰影變深
* **輸入框 (Input)**

  * 高度: 40px
  * 邊框: 1px 實線 #CCCCCC
  * focus 狀態: 邊框顏色 #4B0082
* **卡片 (Card)**

  * 陰影: `0 2px 8px rgba(0,0,0,0.1)`
  * 圓角: 12px
  * 內邊距: 16px

## 響應式設計原則

* 透過 CSS Grid / Flexbox 架構布局。
* 斷點參考: 320px, 576px, 768px, 992px, 1200px。
* 重要內容在最小斷點要可用：按鍵大於 44x44 px，文字不得小於 14px。

## 動畫與過渡效果

* **過渡時間**: 200–300ms ease-in-out。
* **彈性交互**: 按鈕按下回饋 (scale 0.98)，懸停顏色過渡。
* **頁面切換**: 淡入淡出切換主內容，避免全頁刷新。

## 無障礙設計（Accessibility）

* WCAG 2.1 AA 準則: 對比度至少 4.5:1。
* 元件提供 `aria-label`, `role` 等屬性。
* 支持鍵盤導航 (Tab 鍵焦點)、聚焦狀態可見。
* 國際化與多語言支持請參見 [INTERNATIONALIZATION_GUIDELINES.md](../INTERNATIONALIZATION_GUIDELINES.md)

---

如需設計多語言 UI、RTL 排版、動態切換等，請詳見 [INTERNATIONALIZATION_GUIDELINES.md](../INTERNATIONALIZATION_GUIDELINES.md) 