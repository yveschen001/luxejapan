@testable import AutoClicker
import XCTest

@MainActor
final class ImageMatchViewTests: XCTestCase {
    var recognitionService: ImageRecognitionService!
    var viewModel: ImageMatchViewModel!

    override func setUp() {
        super.setUp()
        recognitionService = ImageRecognitionService.shared
        viewModel = ImageMatchViewModel(imageRecognitionService: recognitionService)
    }

    override func tearDown() {
        recognitionService = nil
        viewModel = nil
        super.tearDown()
    }

    func testInitialState() {
        XCTAssertFalse(viewModel.isMatching)
        XCTAssertTrue(viewModel.templates.isEmpty)
    }

    func testStartMatching() {
        viewModel.startMatching()
        XCTAssertTrue(viewModel.isMatching)
    }

    func testStopMatching() {
        viewModel.startMatching()
        viewModel.stopMatching()
        XCTAssertFalse(viewModel.isMatching)
    }

    func testTemplateImage() {
        let template = ImageTemplate(
            imageId: "test-id",
            name: "Test Template",
            image: NSImage(),
            matchThreshold: 0.85,
            maxRetries: 3,
            interval: 1000,
            region: nil
        )

        viewModel.templates.append(template)
        XCTAssertEqual(viewModel.templates.count, 1)
        XCTAssertEqual(viewModel.templates.first?.name, "Test Template")
    }
}
