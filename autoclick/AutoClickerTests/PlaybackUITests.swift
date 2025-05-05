import XCTest

final class PlaybackUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        app = XCUIApplication()
        app.launch()
    }

    override func tearDown() {
        app = nil
        super.tearDown()
    }

    // MARK: - 基本播放功能測試

    func testPlayButtonExists() {
        XCTAssertTrue(app.buttons["playButton"].exists)
    }

    func testPlayButtonState() {
        let playButton = app.buttons["playButton"]
        XCTAssertEqual(playButton.label, "播放")
    }

    func testPlayButtonAction() {
        let playButton = app.buttons["playButton"]
        playButton.tap()
        XCTAssertEqual(app.staticTexts["statusLabel"].label, "播放中")
    }

    // MARK: - 播放控制測試

    func testStopButtonDuringPlayback() {
        let playButton = app.buttons["playButton"]
        let stopButton = app.buttons["stopButton"]

        playButton.tap()
        XCTAssertTrue(stopButton.exists)
        XCTAssertEqual(stopButton.label, "停止")

        stopButton.tap()
        XCTAssertEqual(app.staticTexts["statusLabel"].label, "已停止")
    }

    func testPauseButtonDuringPlayback() {
        let playButton = app.buttons["playButton"]
        let pauseButton = app.buttons["pauseButton"]

        playButton.tap()
        XCTAssertTrue(pauseButton.exists)
        XCTAssertEqual(pauseButton.label, "暫停")

        pauseButton.tap()
        XCTAssertEqual(app.staticTexts["statusLabel"].label, "已暫停")
    }

    // MARK: - 播放進度測試

    func testProgressIndicator() {
        let playButton = app.buttons["playButton"]
        let progressIndicator = app.progressIndicators["progressIndicator"]

        playButton.tap()
        XCTAssertTrue(progressIndicator.exists)
        XCTAssertGreaterThan(progressIndicator.value as! Double, 0.0)
    }

    func testTimeRemainingLabel() {
        let playButton = app.buttons["playButton"]
        let timeLabel = app.staticTexts["timeRemainingLabel"]

        playButton.tap()
        XCTAssertTrue(timeLabel.exists)
        XCTAssertNotEqual(timeLabel.label, "00:00")
    }

    // MARK: - 錯誤處理測試

    func testNoScriptError() {
        let playButton = app.buttons["playButton"]
        playButton.tap()

        let alert = app.alerts["errorAlert"]
        XCTAssertTrue(alert.exists)
        XCTAssertEqual(alert.staticTexts["errorMessage"].label, "沒有可播放的腳本")
    }

    func testInvalidScriptError() {
        // 先創建一個無效的腳本
        let newButton = app.buttons["newScriptButton"]
        newButton.tap()

        let scriptNameField = app.textFields["scriptNameField"]
        scriptNameField.tap()
        scriptNameField.typeText("Invalid Script")

        let saveButton = app.buttons["saveButton"]
        saveButton.tap()

        // 嘗試播放
        let playButton = app.buttons["playButton"]
        playButton.tap()

        let alert = app.alerts["errorAlert"]
        XCTAssertTrue(alert.exists)
        XCTAssertEqual(alert.staticTexts["errorMessage"].label, "腳本格式無效")
    }

    // MARK: - 性能測試

    func testPlaybackPerformance() {
        // 創建一個簡單的腳本
        let newButton = app.buttons["newScriptButton"]
        newButton.tap()

        let scriptNameField = app.textFields["scriptNameField"]
        scriptNameField.tap()
        scriptNameField.typeText("Performance Test")

        let saveButton = app.buttons["saveButton"]
        saveButton.tap()

        // 測量播放性能
        measure {
            let playButton = app.buttons["playButton"]
            playButton.tap()

            let stopButton = app.buttons["stopButton"]
            stopButton.tap()
        }
    }
}
