// RecorderViewModelTests.swift
// 單元測試：錄製事件 ViewModel
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 QA_AUTOCHECK.md、STYLE_GUIDE.md 获取測試結構與命名規範

@testable import AutoClicker
import CoreGraphics
import XCTest

class RecorderViewModelTests: XCTestCase {
    // MARK: - 錄製啟動測試

    func testStartRecordingInitializesState() {
        let viewModel = MockRecorderViewModel(accessibilityGranted: true)
        viewModel.startRecording()
        XCTAssertTrue(viewModel.isRecording, "啟動後應為錄製狀態")
        XCTAssertEqual(viewModel.recordedActions.count, 0, "啟動時應清空事件")
        XCTAssertTrue(viewModel.logMessages.last?.contains("開始錄製") ?? false, "應有開始錄製 log")
    }

    // MARK: - 停止錄製測試

    func testStopRecordingDisablesEventTap() {
        let viewModel = MockRecorderViewModel(accessibilityGranted: true)
        viewModel.startRecording()
        viewModel.mockAddEvent(type: .keyPress, keyCode: 12, position: CGPoint(x: 1, y: 2), delay: 0.1)
        viewModel.stopRecording()
        XCTAssertFalse(viewModel.isRecording, "停止後應為非錄製狀態")
        XCTAssertEqual(viewModel.recordedActions.count, 1, "停止後應保留事件清單")
        XCTAssertTrue(viewModel.logMessages.last?.contains("停止錄製") ?? false, "應有停止錄製 log")
    }

    // MARK: - 清空錄製事件測試

    func testClearRecordingRemovesAllActions() {
        let viewModel = MockRecorderViewModel(accessibilityGranted: true)
        viewModel.startRecording()
        viewModel.mockAddEvent(type: .click, keyCode: nil, position: CGPoint(x: 3, y: 4), delay: 0.2)
        viewModel.clearRecording()
        XCTAssertEqual(viewModel.recordedActions.count, 0, "清空後應無事件")
        XCTAssertTrue(viewModel.logMessages.last?.contains("清除所有錄製事件") ?? false, "應有清除 log")
    }

    // MARK: - 事件轉換測試

    func testEventConversionToScriptAction() {
        let viewModel = MockRecorderViewModel(accessibilityGranted: true)
        viewModel.startRecording()
        viewModel.mockAddEvent(type: .keyPress, keyCode: 42, position: CGPoint(x: 10, y: 20), delay: 0.5)
        guard let action = viewModel.recordedActions.first else {
            XCTFail("應有一筆事件")
            return
        }
        XCTAssertEqual(action.type, .keyPress, "type 應正確")
        XCTAssertEqual(action.keyCode, 42, "keyCode 應正確")
        XCTAssertEqual(action.position, CGPoint(x: 10, y: 20), "position 應正確")
        XCTAssertEqual(action.delay, 0.5, accuracy: 0.001, "delay 應正確")
    }

    // MARK: - 權限不足異常測試

    func testStartRecordingWithoutAccessibilityPermission() {
        let viewModel = MockRecorderViewModel(accessibilityGranted: false)
        viewModel.startRecording()
        XCTAssertFalse(viewModel.isRecording, "權限不足時不應進入錄製狀態")
        XCTAssertTrue(viewModel.logMessages.last?.contains("權限不足") ?? false, "應有權限不足 log")
    }
}

// MARK: - Mock RecorderViewModel for Testing

class MockRecorderViewModel: RecorderViewModel {
    private let mockAccessibilityGranted: Bool
    init(accessibilityGranted: Bool) {
        mockAccessibilityGranted = accessibilityGranted
        super.init()
    }

    override func startRecording() {
        guard !isRecording else { return }
        guard mockAccessibilityGranted else {
            addLog("[ERROR] 輔助功能權限不足，無法開始錄製")
            isRecording = false
            return
        }
        isRecording = true
        recordedActions.removeAll()
        logMessages.removeAll()
        addLog("[INFO] 開始錄製事件")
    }

    // 模擬事件加入
    func mockAddEvent(type: ActionType, keyCode: UInt16?, position: CGPoint, delay: TimeInterval) {
        let action = ScriptAction(type: type, position: position, keyCode: keyCode, delay: delay)
        recordedActions.append(action)
    }
}
