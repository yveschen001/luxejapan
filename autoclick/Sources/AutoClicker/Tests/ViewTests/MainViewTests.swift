@testable import AutoClicker
import XCTest

final class MainViewTests: XCTestCase {
    func testMainViewLoads() {
        let view = MainView()
        XCTAssertNotNil(view)
    }
}
