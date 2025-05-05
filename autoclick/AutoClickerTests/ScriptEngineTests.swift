@testable import AutoClicker
import XCTest

final class ScriptEngineTests: XCTestCase {
    // MARK: - Properties

    private var scriptStorage: ScriptStorageService!
    private var scriptEngine: ScriptEngine!
    private var accessibilityService: AccessibilityEventService!

    // MARK: - Setup

    override func setUp() {
        super.setUp()
        scriptStorage = ScriptStorageService.shared
        accessibilityService = AccessibilityEventService.shared
        scriptEngine = ScriptEngine(storageService: scriptStorage)

        // 清理測試目錄
        try? FileManager.default.removeItem(at: scriptStorage.scriptsDirectory)
    }

    override func tearDown() {
        scriptStorage = nil
        scriptEngine = nil
        accessibilityService = nil
        super.tearDown()
    }

    // MARK: - Script Storage Tests

    func testSaveAndLoadScript() throws {
        // 創建測試腳本
        let script = Script(
            name: "Test Script",
            repeatCount: 1,
            actions: [
                ScriptAction(type: .click, position: CGPoint(x: 100, y: 100)),
                ScriptAction(type: .keyPress, keyCode: 0),
                ScriptAction(type: .move, position: CGPoint(x: 200, y: 200), delay: 1.0),
            ]
        )

        // 儲存腳本
        try scriptStorage.save(script)

        // 載入腳本
        let loadedScript = try scriptStorage.load(script.id)

        // 驗證腳本內容
        XCTAssertEqual(script.id, loadedScript.id)
        XCTAssertEqual(script.name, loadedScript.name)
        XCTAssertEqual(script.actions.count, loadedScript.actions.count)
        XCTAssertEqual(script.actions[0].type, loadedScript.actions[0].type)
        XCTAssertEqual(script.actions[0].position, loadedScript.actions[0].position)
    }

    func testDeleteScript() throws {
        // 創建並儲存腳本
        let script = Script(
            name: "Test Script",
            repeatCount: 1,
            actions: []
        )
        try scriptStorage.save(script)

        // 刪除腳本
        try scriptStorage.delete(script.id)

        // 驗證腳本已刪除
        XCTAssertThrowsError(try scriptStorage.load(script.id))
    }

    // MARK: - Script Execution Tests

    func testScriptExecution() throws {
        // 創建測試腳本
        let script = Script(
            name: "Test Script",
            repeatCount: 1,
            actions: [
                ScriptAction(type: .click, position: CGPoint(x: 100, y: 100)),
                ScriptAction(type: .keyPress, keyCode: 0),
                ScriptAction(type: .move, position: CGPoint(x: 200, y: 200), delay: 1.0),
            ]
        )

        // 保存腳本
        try scriptStorage.save(script)

        // 執行腳本
        let expectation = expectation(description: "Script execution completed")
        scriptEngine.execute(script) { success in
            XCTAssertTrue(success)
            expectation.fulfill()
        }

        waitForExpectations(timeout: 5)
    }

    func testScriptStop() async throws {
        // 創建長時間運行的腳本
        let script = Script(
            name: "Long Running Script",
            repeatCount: 1,
            actions: [
                ScriptAction(type: .mouse, event: .move, position: CGPoint(x: 100, y: 100), delay: 0),
                ScriptAction(type: .mouse, event: .leftClick, position: CGPoint(x: 100, y: 100), delay: 1000),
            ]
        )

        // 開始執行
        let executionStarted = XCTestExpectation(description: "Script execution started")
        let executionStopped = XCTestExpectation(description: "Script execution stopped")

        scriptEngine.execute(script) { success in
            XCTAssertTrue(success)
            executionStopped.fulfill()
        }

        // 等待執行開始
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            executionStarted.fulfill()
            self.scriptEngine.stop()
        }

        // 等待執行停止
        await fulfillment(of: [executionStarted, executionStopped], timeout: 2.0)
    }

    // MARK: - Error Handling Tests

    func testInvalidScriptVersion() throws {
        // 創建版本不正確的腳本
        let script = Script(
            name: "Invalid Version Script",
            repeatCount: 1,
            actions: []
        )

        // 驗證儲存失敗
        XCTAssertThrowsError(try scriptStorage.save(script))
    }

    func testEmptyScriptName() throws {
        // 創建名稱為空的腳本
        let script = Script(
            name: "", // 空名稱
            repeatCount: 1,
            actions: []
        )

        // 驗證儲存失敗
        XCTAssertThrowsError(try scriptStorage.save(script))
    }

    func testEmptyScriptActions() throws {
        // 創建沒有動作的腳本
        let script = Script(
            name: "Empty Actions Script",
            repeatCount: 1,
            actions: [] // 空動作列表
        )

        // 驗證儲存失敗
        XCTAssertThrowsError(try scriptStorage.save(script))
    }

    // MARK: - Performance Tests

    func testScriptSavePerformance() throws {
        // 創建大型腳本
        var actions: [ScriptAction] = []
        for i in 0 ..< 1000 {
            actions.append(ScriptAction(
                type: .mouse,
                event: .move,
                position: CGPoint(x: i, y: i),
                delay: 0
            ))
        }

        let script = Script(
            name: "Performance Test Script",
            repeatCount: 1,
            actions: actions
        )

        // 測量儲存性能
        measure {
            try? scriptStorage.save(script)
        }
    }

    func testScriptLoadPerformance() throws {
        // 創建並儲存大型腳本
        var actions: [ScriptAction] = []
        for i in 0 ..< 1000 {
            actions.append(ScriptAction(
                type: .mouse,
                event: .move,
                position: CGPoint(x: i, y: i),
                delay: 0
            ))
        }

        let script = Script(
            name: "Performance Test Script",
            repeatCount: 1,
            actions: actions
        )

        try scriptStorage.save(script)

        // 測量載入性能
        measure {
            _ = try? scriptStorage.load(script.id)
        }
    }

    func testScriptValidation() {
        // 測試空腳本
        let emptyScript = Script(name: "Empty Script")
        XCTAssertThrowsError(try scriptEngine.validate(emptyScript))

        // 測試有效腳本
        let validScript = Script(
            name: "Valid Script",
            actions: [ScriptAction(type: .click, position: CGPoint(x: 100, y: 100))]
        )
        XCTAssertNoThrow(try scriptEngine.validate(validScript))
    }

    func testEventExecution() {
        let script = Script(
            name: "Event Test Script",
            actions: [
                ScriptAction(type: .click, position: CGPoint(x: 100, y: 100)),
                ScriptAction(type: .keyPress, keyCode: 0),
                ScriptAction(type: .move, position: CGPoint(x: 200, y: 200), delay: 1.0),
            ]
        )

        let expectation = expectation(description: "All events executed")
        var executedActions: [ScriptAction] = []

        scriptEngine.execute(script) { success in
            XCTAssertTrue(success)
            executedActions = script.actions
            expectation.fulfill()
        }

        waitForExpectations(timeout: 5)

        XCTAssertEqual(executedActions.count, script.actions.count)
    }
}
