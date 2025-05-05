// AccessibilityEventServiceTests.swift
// 單元測試：輔助功能事件服務
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 QA_AUTOCHECK.md 获取測試結構與命名規範

@testable import AutoClicker
import CoreGraphics
import XCTest

class AccessibilityEventServiceTests: XCTestCase {
    // MARK: - 權限模擬

    override class func setUp() {
        super.setUp()
        // 可於此處進行全局 mock 設定
    }

    func testSendClickWithPermission() {
        // 假設有權限時，應成功執行
        let service = MockAccessibilityEventService(permission: true)
        let result = service.sendClick(at: CGPoint(x: 100, y: 100))
        XCTAssertTrue(result, "有權限時應成功模擬滑鼠點擊")
    }

    func testSendClickWithoutPermission() {
        // 權限不足時，應回傳 false 並 log
        let service = MockAccessibilityEventService(permission: false)
        let result = service.sendClick(at: CGPoint(x: 100, y: 100))
        XCTAssertFalse(result, "無權限時應回傳 false")
        XCTAssertTrue(service.lastLog.contains("無輔助功能權限"), "應有權限不足提示")
    }

    func testSendKeyWithValidKeyCode() {
        let service = MockAccessibilityEventService(permission: true)
        let result = service.sendKey(keyCode: 0) // 0 = A 鍵
        XCTAssertTrue(result, "合法 keyCode 應成功執行鍵盤事件")
    }

    func testSendKeyWithInvalidKeyCode() {
        let service = MockAccessibilityEventService(permission: true)
        let result = service.sendKey(keyCode: -1) // 不合法 keyCode
        XCTAssertFalse(result, "不合法 keyCode 應回傳 false")
        XCTAssertTrue(service.lastLog.contains("建立鍵盤事件失敗"), "應有錯誤提示")
    }

    func testSendSequenceExecutesAllActions() {
        let service = MockAccessibilityEventService(permission: true)
        let actions = [
            ScriptAction(type: .click, position: CGPoint(x: 10, y: 10)),
            ScriptAction(type: .keyPress, keyCode: 0),
            ScriptAction(type: .keyPress, keyCode: -1), // 故意錯誤
        ]
        let result = service.sendSequence(actions)
        XCTAssertFalse(result, "包含錯誤動作時應回傳 false")
        XCTAssertEqual(service.clickCount, 1, "應執行 1 次滑鼠點擊")
        XCTAssertEqual(service.keyCount, 2, "應執行 2 次鍵盤事件")
    }

    func testSendSequenceWithoutPermission() {
        let service = MockAccessibilityEventService(permission: false)
        let actions = [ScriptAction(type: .click, position: CGPoint(x: 10, y: 10))]
        let result = service.sendSequence(actions)
        XCTAssertFalse(result, "權限不足時應回傳 false")
        XCTAssertTrue(service.lastLog.contains("無輔助功能權限"), "應有權限不足提示")
    }
}

// MARK: - Mock Service for Testing

class MockAccessibilityEventService: AccessibilityEventService {
    private let mockPermission: Bool
    var lastLog: String = ""
    var clickCount = 0
    var keyCount = 0

    init(permission: Bool) {
        mockPermission = permission
        super.init()
    }

    override func hasAccessibilityPermission() -> Bool {
        mockPermission
    }

    override func sendClick(at _: CGPoint) -> Bool {
        if !mockPermission {
            lastLog = "[ERROR] 無輔助功能權限，無法執行滑鼠點擊"
            return false
        }
        clickCount += 1
        return true
    }

    override func sendKey(keyCode: Int) -> Bool {
        if !mockPermission {
            lastLog = "[ERROR] 無輔助功能權限，無法執行鍵盤事件"
            return false
        }
        if keyCode < 0 {
            lastLog = "[ERROR] 建立鍵盤事件失敗"
            keyCount += 1
            return false
        }
        keyCount += 1
        return true
    }

    override func sendSequence(_ actions: [ScriptAction]) -> Bool {
        if !mockPermission {
            lastLog = "[ERROR] 無輔助功能權限，無法執行腳本序列"
            return false
        }
        var allSuccess = true
        for action in actions {
            switch action.type {
            case .click:
                let result = sendClick(at: action.position)
                allSuccess = allSuccess && result
            case .keyPress:
                if let keyCode = action.keyCode {
                    let result = sendKey(keyCode: Int(keyCode))
                    allSuccess = allSuccess && result
                } else {
                    lastLog = "[ERROR] 缺少 keyCode，無法執行鍵盤事件"
                    allSuccess = false
                }
            default:
                lastLog = "[WARNING] 不支援的動作類型：\(action.type)"
                allSuccess = false
            }
        }
        return allSuccess
    }
}
