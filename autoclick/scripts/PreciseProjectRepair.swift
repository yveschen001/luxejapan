// PreciseProjectRepair.swift
// 針對 AutoClickerAppXcode/AutoClicker/ 目錄結構的自動修復腳本

import ProjectAutomation

@main
struct PreciseProjectRepair: Runnable {
    func run() throws {
        // 修復主 target
        fixTargetMembership()

        // 主程式碼
        addSource("App/AppDelegate.swift", target: "AutoClicker")
        addSource("App/AutoClickerApp.swift", target: "AutoClicker")
        if fileExists("App/Setup.swift") {
            addSource("App/Setup.swift", target: "AutoClicker")
        }

        addSource("Views/ScriptListItemView.swift", target: "AutoClicker")
        addSource("Views/MainView.swift", target: "AutoClicker")
        addSource("Views/RecorderView.swift", target: "AutoClicker")
        addSource("Views/ImageMatchView.swift", target: "AutoClicker")
        addSource("Views/SettingsView.swift", target: "AutoClicker")

        addSource("ViewModels/MainViewModel.swift", target: "AutoClicker")
        addSource("ViewModels/RecorderViewModel.swift", target: "AutoClicker")
        addSource("ViewModels/ImageMatchViewModel.swift", target: "AutoClicker")

        addSource("Models/Script.swift", target: "AutoClicker")
        addSource("Models/ScriptAction.swift", target: "AutoClicker")
        if fileExists("Models/ImageTemplate.swift") {
            addSource("Models/ImageTemplate.swift", target: "AutoClicker")
        }

        addSource("Services/ScriptStorageService.swift", target: "AutoClicker")
        addSource("Services/ImageRecognitionService.swift", target: "AutoClicker")
        addSource("Services/AccessibilityEventService.swift", target: "AutoClicker")
        if fileExists("Services/LogService.swift") {
            addSource("Services/LogService.swift", target: "AutoClicker")
        }

        // 資源
        addResource("Assets.xcassets", target: "AutoClicker")
        addResource("Info.plist", target: "AutoClicker")
        addResource("Resources/zh-Hans.lproj", target: "AutoClicker")
        addResource("Resources/en.lproj", target: "AutoClicker")

        // 測試
        addTest("AutoClickerTests/ScriptEngineTests.swift", target: "AutoClickerTests")
        if fileExists("AutoClickerUITests/PlaybackUITests.swift") {
            addTest("AutoClickerUITests/PlaybackUITests.swift", target: "AutoClickerUITests")
        }
        if fileExists("AutoClickerUITests/AutoClickerUITests.swift") {
            addTest("AutoClickerUITests/AutoClickerUITests.swift", target: "AutoClickerUITests")
        }
        if fileExists("AutoClickerUITests/AutoClickerUITestsLaunchTests.swift") {
            addTest("AutoClickerUITests/AutoClickerUITestsLaunchTests.swift", target: "AutoClickerUITests")
        }

        // 防呆：Setup.swift 若不存在則自動生成
        if !fileExists("App/Setup.swift") {
            createFile("App/Setup.swift") {
                """
                // Setup.swift
                // 建立 App 初始結構、匯入必要依賴

                import SwiftUI

                struct Setup {
                    static func configure() {
                        // 初始化 App 各服務
                    }
                }
                """
            }
            addSource("App/Setup.swift", target: "AutoClicker")
        }

        // 綜合檢查與文檔驗證
        run("Tools/CHECK_ALL.swift")
        check("docs/NEXT_TASKS.md")
        check("docs/PROJECT_PLAN_TODO.md")

        print("✅ 精確修復與同步完成。請重新開啟 Xcode 或清除 Derived Data 後建置專案。")
    }
}
