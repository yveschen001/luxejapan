@testable import AutoClicker
import XCTest

final class ScriptStorageServiceTests: XCTestCase {
    func testScriptStorageServiceInitialization() {
        let service = ScriptStorageService.shared
        XCTAssertNotNil(service)
    }
}
