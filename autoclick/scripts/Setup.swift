// MARK: 🛠 AutoClicker 專案初始化總指令

//
// 本檔案用於專案初始化與結構自動化說明，請依照下列步驟建立與檢查專案結構。
//
// ------------------------------------------------------------
//
// ✅ 1. 建立專案資料夾結構（如未存在請新增）：
// - Views/
// - ViewModels/
// - Services/
// - Models/
//
// ✅ 2. 建立並實作以下檔案與內容（若不存在）：
//
// --- MainApp 入口 ---
// - App/MainApp.swift
//   - 使用 SwiftUI App 協定與 @main
//   - 注入 MainViewModel、RecorderViewModel、ImageMatchViewModel 作為 .environmentObject
//   - 使用 AppDelegate.swift 處理啟動權限
//
// --- 主畫面與 ViewModel ---
// - Views/MainView.swift：腳本列表（ScriptListItemView）、控制按鈕、log 區塊
// - ViewModels/MainViewModel.swift：管理腳本清單、錄製播放控制、log 紀錄（使用 @Published）
//
// --- 列表元件 ---
// - Views/ScriptListItemView.swift：每筆腳本項目，顯示名稱與播放、編輯、刪除按鈕，支援 closure 傳入操作
//
// --- 播放引擎 ---
// - Services/ScriptActionPlayer.swift：依據 ScriptAction 執行滑鼠、鍵盤與延遲邏輯（串接 AccessibilityEventService）
//
// ✅ 3. 確認所有檔案都加入 AutoClicker 主 App target（非 Test）
//
// ✅ 4. 如果 ContentView.swift 尚存在，請提醒我可以刪除，改以 MainView 為預設畫面
//
// ✅ 5. 確保 Views/MainView.swift 能在 Xcode Canvas 預覽（#Preview / PreviewProvider）
// ✅ 6. 所有命名、縮排與風格請符合 SwiftUI + macOS 專案標準（符合 docs/STYLE_GUIDE.md）
//
// ------------------------------------------------------------
// 建立結構後，可逐步加入 RecorderView、SettingsView 等畫面與模組
