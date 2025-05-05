import ScreenCaptureKit
import SwiftUI

@main
struct AutoClickerApp: App {
    @StateObject private var appDelegate = AppDelegate()

    var body: some Scene {
        WindowGroup {
            AutoClickerView()
        }
        .windowResizable(false)
        .windowStyle(.hiddenTitleBar)
    }
}

class AppDelegate: NSObject, ObservableObject {
    private let logService = LogService.shared
    private let dataManager = DataManager.shared

    override init() {
        super.init()
        Task {
            await initializeApp()
        }
    }

    private func initializeApp() async {
        do {
            // 检查屏幕录制权限
            if !SCShareableContent.current.displays.isEmpty {
                await logService.info("屏幕录制权限已授予")
            } else {
                await logService.warning("屏幕录制权限未授予")
                // 提示用户授予权限
                if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenRecording") {
                    NSWorkspace.shared.open(url)
                }
            }

            // 检查辅助功能权限
            if AXIsProcessTrusted() {
                await logService.info("辅助功能权限已授予")
            } else {
                await logService.warning("辅助功能权限未授予")
                // 提示用户授予权限
                if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility") {
                    NSWorkspace.shared.open(url)
                }
            }

            // 初始化数据文件夹
            try await dataManager.initializeDataFolder()
            await logService.info("应用初始化完成")
        } catch {
            await logService.error("应用初始化失败：\(error.localizedDescription)")
        }
    }
}
