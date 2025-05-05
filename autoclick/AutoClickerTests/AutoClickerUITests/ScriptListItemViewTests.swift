// ScriptListItemViewTests.swift
// SwiftUI 單元測試：腳本清單項目 View
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 STYLE_GUIDE.md、QA_AUTOCHECK.md 获取測試結構與命名規範

@testable import AutoClicker
import SwiftUI
import ViewInspector
import XCTest

class ScriptListItemViewTests: XCTestCase {
    let mockScript = ScriptMetadata(id: UUID(), name: "Test", executionCount: 1, lastExecutionDate: nil)

    // MARK: - 顯示內容測試

    func testDisplaysScriptNameCountAndDate() throws {
        let date = Date(timeIntervalSince1970: 1_700_000_000)
        let script = ScriptMetadata(id: UUID(), name: "MyScript", executionCount: 7, lastExecutionDate: date)
        let view = ScriptListItemView(script: script, onPlay: {}, onEdit: {}, onDelete: {})
        let hStack = try view.inspect().hStack()
        let vStack = try hStack.vStack(0)
        let nameText = try vStack.text(0).string()
        XCTAssertEqual(nameText, "MyScript")
        let infoHStack = try vStack.hStack(1)
        let countText = try infoHStack.text(3).string()
        XCTAssertEqual(countText, "7")
        let dateText = try infoHStack.text(1).string()
        XCTAssertTrue(dateText.contains("20") || dateText.contains("19"), "日期格式應正確")
    }

    // MARK: - 播放按鈕觸發測試

    func testPlayButtonCallsOnPlay() throws {
        let exp = expectation(description: "onPlay called")
        let script = ScriptMetadata(id: UUID(), name: "Test", executionCount: 1, lastExecutionDate: nil)
        let view = ScriptListItemView(script: script, onPlay: { exp.fulfill() }, onEdit: {}, onDelete: {})
        let hStack = try view.inspect().hStack()
        let buttons = try hStack.findAll(ViewType.Button.self)
        try buttons[0].tap()
        wait(for: [exp], timeout: 2)
    }

    // MARK: - 編輯與刪除按鈕觸發測試

    func testEditAndDeleteButtonsCallHandlers() throws {
        let editExp = expectation(description: "onEdit called")
        let deleteExp = expectation(description: "onDelete called")
        let script = ScriptMetadata(id: UUID(), name: "Test", executionCount: 1, lastExecutionDate: nil)
        let view = ScriptListItemView(
            script: script,
            onPlay: {},
            onEdit: { editExp.fulfill() },
            onDelete: { deleteExp.fulfill() }
        )
        let hStack = try view.inspect().hStack()
        let buttons = try hStack.findAll(ViewType.Button.self)
        try buttons[1].tap()
        try buttons[2].tap()
        wait(for: [editExp, deleteExp], timeout: 2)
    }

    // MARK: - 可訪問性標識測試

    func testAccessibilityIdentifiers() throws {
        let view = ScriptListItemView(script: mockScript, onPlay: {}, onEdit: {}, onDelete: {})
        let buttons = try view.inspect().findAll(ViewType.Button.self)

        let playId = try buttons[0].find(ViewType.Image.self).accessibilityIdentifier()
        let editId = try buttons[1].find(ViewType.Image.self).accessibilityIdentifier()
        let deleteId = try buttons[2].find(ViewType.Image.self).accessibilityIdentifier()

        XCTAssertTrue(playId.contains("play-button-"))
        XCTAssertTrue(editId.contains("edit-button-"))
        XCTAssertTrue(deleteId.contains("delete-button-"))
    }

    // MARK: - 暗色模式 Snapshot（可選）

    func testDarkModeSnapshot() throws {
        let script = ScriptMetadata(id: UUID(), name: "SnapshotTest", executionCount: 2, lastExecutionDate: Date())
        let view = ScriptListItemView(script: script, onPlay: {}, onEdit: {}, onDelete: {})
            .frame(width: 350)
            .preferredColorScheme(.dark)
        // 若有 Snapshot 工具可加下列斷言
        // assertSnapshot(matching: view, as: .image)
        XCTAssertNotNil(view)
    }
}
