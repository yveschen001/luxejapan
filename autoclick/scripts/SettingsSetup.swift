// MARK: ⚙️ 建立設定模組（SettingsView 與 ViewModel）

//
// 請幫我建立 SettingsView 與 SettingsViewModel：
//
// ✅ 1. 建立 Views/SettingsView.swift：
// - 分區顯示設定：快捷鍵設定、語言切換、自動啟動、儲存路徑
// - 每個快捷鍵欄位可編輯並即時儲存（播放、錄製、停止）
// - 使用 Picker 切換語言（en, zh-TW）
// - 顯示資料儲存路徑（readonly）並附「前往」Finder 按鈕
// - 使用 LocalizedStringKey 與 .accessibilityIdentifier
//
// ✅ 2. 建立 ViewModels/SettingsViewModel.swift：
// - 使用 @Published 管理設定資料（快捷鍵、語言、自啟開關）
// - 提供方法儲存與載入設定（UserDefaults 儲存）
// - 支援檢查快捷鍵衝突，提示使用者
// - 使用 Bundle.main 路徑判斷儲存資料夾位置
//
// ✅ 3. 整合要求：
// - 所有設定結構需符合 docs/SHORTCUTS.md 與 docs/SECURITY_POLICY.md
// - 所有欄位與行為請符合 docs/STYLE_GUIDE.md 命名與 docs/QA_AUTOCHECK.md 驗收規則
// - 完成後可在 MainView 呼叫 SettingsView（例如用 sheet 呈現）
// - 如無權限或錯誤，請 log 錯誤並提示用戶
