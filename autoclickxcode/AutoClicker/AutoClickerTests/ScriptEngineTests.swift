// AutoClicker
// Copyright © 2024 Your Name. All rights reserved.
// Created by AI Assistant on 2024-05-02.

@testable import AutoClicker
import XCTest

@MainActor
final class ScriptEngineTests: XCTestCase {
    var scriptEngine: ScriptEngine!

    override func setUp() async throws {
        try await super.setUp()
        scriptEngine = ScriptEngine()
    }

    override func tearDown() {
        scriptEngine = nil
        super.tearDown()
    }

    func testScriptExecution() async throws {
        // 創建測試腳本
        let script = Script(
            name: "Test Script",
            actions: [
                ScriptAction(type: .click, position: CGPoint(x: 100, y: 100)),
                ScriptAction(type: .delay, delay: 1.0),
                ScriptAction(type: .keyPress, keyCode: 0),
            ]
        )

        // 執行腳本
        let expectation = expectation(description: "Script execution completed")
        scriptEngine.execute(script) { success in
            XCTAssertTrue(success)
            expectation.fulfill()
        }
        await fulfillment(of: [expectation], timeout: 5.0)
    }

    func testScriptValidation() async throws {
        // 測試空腳本
        let emptyScript = Script(name: "Empty Script", actions: [])
        XCTAssertThrowsError(try scriptEngine.validate(emptyScript))

        // 測試有效腳本
        let validScript = Script(
            name: "Valid Script",
            actions: [
                ScriptAction(type: .click, position: CGPoint(x: 100, y: 100)),
            ]
        )
        XCTAssertNoThrow(try scriptEngine.validate(validScript))
    }

    func testEventHandling() async throws {
        let script = Script(
            name: "Event Test Script",
            actions: [
                ScriptAction(type: .click, position: CGPoint(x: 100, y: 100)),
                ScriptAction(type: .delay, delay: 1.0),
                ScriptAction(type: .keyPress, keyCode: 0),
            ]
        )

        let expectation = expectation(description: "All events executed")
        scriptEngine.execute(script) { success in
            XCTAssertTrue(success)
            expectation.fulfill()
        }
        await fulfillment(of: [expectation], timeout: 5.0)
    }
}
