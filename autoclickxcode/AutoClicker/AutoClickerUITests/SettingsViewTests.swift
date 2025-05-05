// SettingsViewTests.swift
// SwiftUI 單元測試：使用者設定介面
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 STYLE_GUIDE.md、QA_AUTOCHECK.md 获取測試結構與命名規範

@testable import AutoClicker
import ServiceManagement
import SwiftUI
import ViewInspector
import XCTest

class MockSMAppService: AppServiceProtocol {
    typealias Service = MockSMAppService
    static var isRegistered = false
    static var mainApp = MockSMAppService()

    func register() throws {
        MockSMAppService.isRegistered = true
    }

    func unregister() throws {
        MockSMAppService.isRegistered = false
    }
}

final class SettingsViewTests: XCTestCase {
    static var allTests = [
        ("testAutoLaunchSetting", testAutoLaunchSetting),
        ("testLanguageSetting", testLanguageSetting),
        ("testShortcutInput", testShortcutInput),
        ("testShortcutSettings", testShortcutSettings),
    ]

    var viewModel: SettingsViewModel!

    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        viewModel = SettingsViewModel()
    }

    override func tearDown() {
        viewModel = nil
        super.tearDown()
    }

    func testAutoLaunchSetting() throws {
        let view = SettingsView(viewModel: viewModel)
        let autoLaunchToggle = try view.inspect().find(viewWithAccessibilityIdentifier: "auto-launch-toggle")
        XCTAssertNotNil(autoLaunchToggle, "自動啟動開關應存在")

        try autoLaunchToggle.toggle().tap()
        XCTAssertTrue(viewModel.isAutoLaunchEnabled, "點擊自動啟動開關後應啟用自動啟動")
    }

    func testLanguageSetting() throws {
        let view = SettingsView(viewModel: viewModel)
        let languagePicker = try view.inspect().find(viewWithAccessibilityIdentifier: "language-picker")
        XCTAssertNotNil(languagePicker, "語言選擇器應存在")

        try languagePicker.picker().select(value: "zh-Hans")
        XCTAssertEqual(viewModel.selectedLanguage, "zh-Hans", "選擇語言後應更新語言設置")
    }

    func testShortcutInput() throws {
        let view = SettingsView(viewModel: viewModel)
        let shortcutInput = try view.inspect().find(viewWithAccessibilityIdentifier: "shortcut-input")
        XCTAssertNotNil(shortcutInput, "快捷鍵輸入框應存在")

        try shortcutInput.textField().setInput("⌘P")
        XCTAssertEqual(viewModel.shortcutKey, "⌘P", "輸入快捷鍵後應更新快捷鍵設置")
    }

    func testShortcutSettings() throws {
        let view = SettingsView(viewModel: viewModel)
        let shortcutSettings = try view.inspect().find(viewWithAccessibilityIdentifier: "shortcut-settings")
        XCTAssertNotNil(shortcutSettings, "快捷鍵設置區域應存在")

        let playShortcut = try shortcutSettings.find(viewWithAccessibilityIdentifier: "play-shortcut")
        let stopShortcut = try shortcutSettings.find(viewWithAccessibilityIdentifier: "stop-shortcut")
        XCTAssertNotNil(playShortcut, "播放快捷鍵設置應存在")
        XCTAssertNotNil(stopShortcut, "停止快捷鍵設置應存在")
    }
}

// MARK: - Mock for openStoragePath

struct SettingsViewMockOpenStorage: View {
    var onOpen: () -> Void

    var body: some View {
        Form {
            Section(header: Text("storage_path")) {
                HStack {
                    Text("test/path")
                        .font(.footnote)
                        .lineLimit(1)
                        .truncationMode(.middle)
                        .accessibilityIdentifier("storage-path-label")
                    Button("go_to") {
                        onOpen()
                    }
                    .accessibilityIdentifier("go-to-storage-button")
                }
            }
        }
    }
}
