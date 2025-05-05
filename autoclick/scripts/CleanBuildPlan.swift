#!/usr/bin/env swift

import Foundation

// MARK: - 工具函數

func fileExists(at path: String) -> Bool {
    FileManager.default.fileExists(atPath: path)
}

func deleteFile(at path: String) throws {
    if fileExists(at: path) {
        try FileManager.default.removeItem(atPath: path)
        print("✅ 已刪除：\(path)")
    }
}

func markFileAsUnused(at path: String) {
    if fileExists(at: path) {
        print("🔸 標記為未使用：\(path)")
    }
}

// MARK: - 主要邏輯

func cleanProject() {
    print("🧹 開始清理項目...")

    // 1. 檢查並處理 @main 入口點
    let mainAppPath = "AutoClicker/MainApp.swift"
    if fileExists(at: mainAppPath) {
        do {
            try deleteFile(at: mainAppPath)
        } catch {
            print("❌ 刪除 MainApp.swift 失敗：\(error)")
        }
    }

    // 2. 檢查並處理 iOS 相關文件
    let iosFiles = [
        "AutoClicker/AppDelegate.swift",
        "AutoClicker/SceneDelegate.swift",
        "AutoClicker/ContentView.swift",
    ]

    for file in iosFiles {
        if fileExists(at: file) {
            do {
                try deleteFile(at: file)
            } catch {
                print("❌ 刪除 \(file) 失敗：\(error)")
            }
        }
    }

    // 3. 標記未使用的文件
    let unusedFiles = [
        "AutoClicker/Views/RecorderView.swift",
        "AutoClicker/Views/ImageMatchView.swift",
        "AutoClicker/Views/SettingsView.swift",
        "AutoClicker/ViewModels/RecorderViewModel.swift",
        "AutoClicker/ViewModels/ImageMatchViewModel.swift",
        "AutoClicker/ViewModels/SettingsViewModel.swift",
        "AutoClicker/Models/Script.swift",
        "AutoClicker/Models/ScriptAction.swift",
        "AutoClicker/Models/RecognitionResult.swift",
        "AutoClicker/Services/ScriptStorageService.swift",
        "AutoClicker/Services/ImageRecognitionService.swift",
        "AutoClicker/Services/AccessibilityEventService.swift",
    ]

    for file in unusedFiles {
        markFileAsUnused(at: file)
    }

    print("\n✔ CleanBuildPlan 完成\n")
}

// MARK: - 執行清理

cleanProject()
