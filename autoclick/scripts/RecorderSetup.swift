// MARK: 🎥 建立錄製模組

//
// 請幫我建立 AutoClicker 的錄製模組：
//
// ✅ 建立 Views/RecorderView.swift：
// - 支援錄製滑鼠與鍵盤動作
// - 顯示目前錄製中的 ScriptAction 清單（可編輯 delay）
// - 包含「開始錄製」、「停止錄製」、「清除」按鈕
//
// ✅ 建立 ViewModels/RecorderViewModel.swift：
// - 管理 @Published var recordedActions: [ScriptAction]
// - 提供方法：startRecording()、stopRecording()、clearRecording()
// - 支援 CGEventTap 錄製滑鼠與鍵盤事件
// - 檢查 Accessibility 權限，若不足請提示
//
// ✅ 所有結構命名與欄位請符合 docs/DATA_SCHEMA.md 與 docs/STYLE_GUIDE.md
// ✅ 可加入 MainView 中，錄製後儲存為 JSON 檔
// ✅ 若有問題請依 docs/QA_AUTOCHECK.md 註明缺口並補齊
