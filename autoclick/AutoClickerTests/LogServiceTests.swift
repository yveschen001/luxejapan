// LogServiceTests.swift
// 單元測試：LogService 日誌服務
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 STYLE_GUIDE.md、QA_AUTOCHECK.md 获取測試結構與命名規範

@testable import AutoClicker
import Combine
import XCTest

class LogServiceTests: XCTestCase {
    var cancellables: Set<AnyCancellable> = []

    override func setUp() {
        super.setUp()
        LogService.shared.clear()
    }

    override func tearDown() {
        LogService.shared.clear()
        cancellables.removeAll()
        super.tearDown()
    }

    // MARK: - 測試 log(_:) 新增日誌

    func testLogAddsEntryWithTimestampAndSource() {
        // 執行
        LogService.shared.log("測試訊息", source: "單元測試")

        // 驗證
        let logs = LogService.shared.logs
        XCTAssertEqual(logs.count, 1)
        let entry = logs.first!
        XCTAssertEqual(entry.message, "測試訊息")
        XCTAssertEqual(entry.source, "單元測試")
        XCTAssertLessThan(abs(entry.timestamp.timeIntervalSinceNow), 2.0) // timestamp 為近期
    }

    // MARK: - 測試 @Published logs 屬性即時更新

    func testLogsPublishedUpdates() {
        let expectation = XCTestExpectation(description: "logs 屬性應即時通知 UI")
        var updateCount = 0

        LogService.shared.$logs
            .dropFirst() // 忽略初始值
            .sink { logs in
                updateCount += 1
                if updateCount == 1 {
                    XCTAssertEqual(logs.count, 1)
                    expectation.fulfill()
                }
            }
            .store(in: &cancellables)

        LogService.shared.log("UI 更新測試")
        wait(for: [expectation], timeout: 2.0)
    }

    // MARK: - 測試 clear() 清空日誌

    func testClearRemovesAllLogsAndNotifies() {
        let expectation = XCTestExpectation(description: "clear() 應通知 logs 變更")
        LogService.shared.log("待清空日誌")

        LogService.shared.$logs
            .dropFirst(2) // 1: 新增, 2: 清空
            .sink { logs in
                XCTAssertEqual(logs.count, 0)
                expectation.fulfill()
            }
            .store(in: &cancellables)

        LogService.shared.clear()
        wait(for: [expectation], timeout: 2.0)
    }

    // MARK: - 測試 exportLogs() 匯出日誌內容

    func testExportLogsOutputsCorrectTextFile() throws {
        LogService.shared.log("匯出測試", source: "ExportTest")
        let url = try LogService.shared.exportLogs()
        let content = try String(contentsOf: url, encoding: .utf8)
        XCTAssertTrue(content.contains("ExportTest"))
        XCTAssertTrue(content.contains("匯出測試"))
        XCTAssertTrue(content.contains("[INFO]"))
    }
}
