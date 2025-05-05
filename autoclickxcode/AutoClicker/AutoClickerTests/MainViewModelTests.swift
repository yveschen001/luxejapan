@testable import AutoClicker
import XCTest

@MainActor
final class MainViewModelTests: XCTestCase {
    func testMainViewModelInitialization() {
        let viewModel = MainViewModel()
        XCTAssertNotNil(viewModel)
    }
}
