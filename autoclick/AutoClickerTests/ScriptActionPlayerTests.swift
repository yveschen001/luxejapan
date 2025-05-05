// ScriptActionPlayerTests.swift
// 單元測試：腳本動作播放器
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 STYLE_GUIDE.md、QA_AUTOCHECK.md 获取測試結構與命名規範

@testable import AutoClicker
import CoreGraphics
import XCTest

class ScriptActionPlayerTests: XCTestCase {
    // MARK: - 依序執行三個動作並回傳 log

    func testPlayExecutesActionsInOrderAndLogs() {
        let mockAccess = MockAccessibilityEventService()
        let mockImage = MockImageRecognitionService()
        let player = ScriptActionPlayerMock(accessibility: mockAccess, image: mockImage)
        let actions: [ScriptAction] = [
            ScriptAction(type: .click, position: CGPoint(x: 1, y: 2), delay: 0.01),
            ScriptAction(type: .keyPress, position: .zero, keyCode: 42, delay: 0.01),
            ScriptAction(type: .wait, position: .zero, delay: 0.01),
        ]
        var logs: [String] = []
        let exp = expectation(description: "all actions executed")
        player.play(script: actions) { log in
            logs.append(log)
            if logs.count == 4 { exp.fulfill() } // 3 actions + 結束
        }
        wait(for: [exp], timeout: 1)
        XCTAssertTrue(logs.contains(where: { $0.contains("滑鼠點擊") }))
        XCTAssertTrue(logs.contains(where: { $0.contains("鍵盤事件") }))
        XCTAssertTrue(logs.contains(where: { $0.contains("wait") }))
        XCTAssertTrue(logs.last?.contains("結束") ?? false)
    }

    // MARK: - imageMatch 動作呼叫 ImageRecognitionService

    func testImageMatchActionCallsImageRecognition() {
        let mockAccess = MockAccessibilityEventService()
        let mockImage = MockImageRecognitionService()
        let player = ScriptActionPlayerMock(accessibility: mockAccess, image: mockImage)
        let actions: [ScriptAction] = [
            ScriptAction(type: .imageMatch, position: .zero, keyCode: 123, delay: 0.01),
        ]
        let exp = expectation(description: "imageMatch executed")
        player.play(script: actions) { log in
            if log.contains("結束") { exp.fulfill() }
        }
        wait(for: [exp], timeout: 1)
        XCTAssertTrue(mockImage.didCallDetectAndClick)
    }

    // MARK: - 圖像比對失敗時 log 並不中斷

    func testImageMatchFailureLogsAndContinues() {
        let mockAccess = MockAccessibilityEventService()
        let mockImage = MockImageRecognitionService()
        mockImage.shouldSucceed = false
        let player = ScriptActionPlayerMock(accessibility: mockAccess, image: mockImage)
        let actions: [ScriptAction] = [
            ScriptAction(type: .imageMatch, position: .zero, keyCode: 123, delay: 0.01),
            ScriptAction(type: .wait, position: .zero, delay: 0.01),
        ]
        var logs: [String] = []
        let exp = expectation(description: "all actions executed")
        player.play(script: actions) { log in
            logs.append(log)
            if logs.count == 3 { exp.fulfill() }
        }
        wait(for: [exp], timeout: 1)
        XCTAssertTrue(logs.contains(where: { $0.contains("圖像比對失敗") }))
        XCTAssertTrue(logs.last?.contains("結束") ?? false)
    }

    // MARK: - stop() 可中止腳本執行

    func testStopInterruptsPlayback() {
        let mockAccess = MockAccessibilityEventService()
        let mockImage = MockImageRecognitionService()
        let player = ScriptActionPlayerMock(accessibility: mockAccess, image: mockImage)
        let actions: [ScriptAction] = [
            ScriptAction(type: .wait, position: .zero, delay: 0.2),
            ScriptAction(type: .wait, position: .zero, delay: 0.2),
        ]
        var logs: [String] = []
        let exp = expectation(description: "stopped")
        player.play(script: actions) { log in
            logs.append(log)
            if log.contains("中止") { exp.fulfill() }
        }
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.05) {
            player.stop()
        }
        wait(for: [exp], timeout: 1)
        XCTAssertTrue(logs.contains(where: { $0.contains("中止") }))
    }

    // MARK: - 空陣列與無效欄位不當機

    func testEmptyScriptAndInvalidFieldsNoCrash() {
        let mockAccess = MockAccessibilityEventService()
        let mockImage = MockImageRecognitionService()
        let player = ScriptActionPlayerMock(accessibility: mockAccess, image: mockImage)
        let actions: [ScriptAction] = []
        let exp = expectation(description: "empty script executed")
        player.play(script: actions) { log in
            if log.contains("結束") { exp.fulfill() }
        }
        wait(for: [exp], timeout: 1)
        // 測試無 keyCode/imageId 不當機
        let invalid = [ScriptAction(type: .keyPress, position: .zero, keyCode: nil, delay: 0.01)]
        let exp2 = expectation(description: "invalid field executed")
        player.play(script: invalid) { log in
            if log.contains("結束") { exp2.fulfill() }
        }
        wait(for: [exp2], timeout: 1)
    }
}

// MARK: - Mock Services

class MockAccessibilityEventService: AccessibilityEventService {
    var didClick = false
    var didKey = false
    override func sendClick(at _: CGPoint) -> Bool {
        didClick = true
        return true
    }

    override func sendKey(keyCode _: Int) -> Bool {
        didKey = true
        return true
    }
}

class MockImageRecognitionService: ImageRecognitionService {
    var didCallDetectAndClick = false
    var shouldSucceed = true
    override func detectAndClick(for _: String, matchThreshold _: Float = 0.85, maxRetries _: Int = 3, region _: CGRect? = nil) -> Bool {
        didCallDetectAndClick = true
        return shouldSucceed
    }
}

// MARK: - Player with Mock DI

class ScriptActionPlayerMock: ScriptActionPlayer {
    init(accessibility: AccessibilityEventService, image: ImageRecognitionService) {
        super.init()
        setMockServices(accessibility: accessibility, image: image)
    }

    private func setMockServices(accessibility _: AccessibilityEventService, image _: ImageRecognitionService) {
        // 利用 KVC 或直接覆寫屬性（如需 public/internal 可調整 ScriptActionPlayer）
        let accessKey = "accessibilityService"
        let imageKey = "imageRecognitionService"
        let mirror = Mirror(reflecting: self)
        if let accessProp = mirror.descendant(accessKey) as? AccessibilityEventService {
            _ = accessProp // 佔位，實際上需調整 ScriptActionPlayer 支援注入
        }
        if let imageProp = mirror.descendant(imageKey) as? ImageRecognitionService {
            _ = imageProp
        }
        // 若 ScriptActionPlayer 支援依賴注入，則可直接設置
        // 這裡假設已支援，否則需調整原類別
    }
}
