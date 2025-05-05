@testable import AutoClicker
import SwiftUI
import ViewInspector
import XCTest

final class PlaybackUITests: XCTestCase {
    static var allTests = [
        ("testPlayButtonExistsAndWorks", testPlayButtonExistsAndWorks),
        ("testStopButtonStopsPlayback", testStopButtonStopsPlayback),
        ("testPlaybackShortcut", testPlaybackShortcut),
        ("testPlaybackErrorHandling", testPlaybackErrorHandling),
    ]

    var viewModel: PlaybackViewModel!

    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        viewModel = PlaybackViewModel()
    }

    override func tearDown() {
        viewModel = nil
        super.tearDown()
    }

    func testPlayButtonExistsAndWorks() throws {
        let view = ContentView(viewModel: viewModel)
        let playButton = try view.inspect().find(viewWithAccessibilityIdentifier: "play-button")
        XCTAssertNotNil(playButton, "播放按鈕應存在於主界面")

        try playButton.button().tap()
        XCTAssertTrue(viewModel.isPlaying, "點擊播放按鈕後應開始播放")
    }

    func testStopButtonStopsPlayback() throws {
        let view = ContentView(viewModel: viewModel)
        let playButton = try view.inspect().find(viewWithAccessibilityIdentifier: "play-button")
        try playButton.button().tap()

        let stopButton = try view.inspect().find(viewWithAccessibilityIdentifier: "stop-button")
        XCTAssertNotNil(stopButton, "停止按鈕應存在於播放時")
        try stopButton.button().tap()

        XCTAssertFalse(viewModel.isPlaying, "點擊停止按鈕後應停止播放")
    }

    func testPlaybackShortcut() throws {
        let view = ContentView(viewModel: viewModel)
        let shortcutButton = try view.inspect().find(viewWithAccessibilityIdentifier: "shortcut-button")
        XCTAssertNotNil(shortcutButton, "快捷鍵按鈕應存在")

        try shortcutButton.button().tap()
        XCTAssertTrue(viewModel.isShortcutEnabled, "點擊快捷鍵按鈕後應啟用快捷鍵")
    }

    func testPlaybackErrorHandling() throws {
        let view = ContentView(viewModel: viewModel)
        viewModel.simulateError = true

        let playButton = try view.inspect().find(viewWithAccessibilityIdentifier: "play-button")
        try playButton.button().tap()

        let errorText = try view.inspect().find(text: "播放錯誤")
        XCTAssertNotNil(errorText, "發生錯誤時應顯示錯誤信息")
    }
}
