// ImageMatchViewTests.swift
// 圖像匹配視圖測試：測試圖像模板管理和匹配功能
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/QA_AUTOCHECK.md 获取测试规范

@testable import AutoClicker
import XCTest

@MainActor
final class ImageMatchViewTests: XCTestCase {
    var viewModel: ImageMatchViewModel!

    override func setUp() async throws {
        try await super.setUp()
        viewModel = ImageMatchViewModel()
    }

    override func tearDown() {
        viewModel = nil
        super.tearDown()
    }

    func testInitialState() async {
        XCTAssertFalse(viewModel.isMatching)
        XCTAssertTrue(viewModel.templates.isEmpty)
    }

    func testStartMatching() async {
        let template = ImageTemplate(
            imageId: "test-id",
            name: "Test Template",
            image: NSImage(),
            matchThreshold: 0.85,
            maxRetries: 3,
            interval: 1000,
            region: nil
        )
        viewModel.addTemplate(template)
        viewModel.startMatching()
        XCTAssertTrue(viewModel.isMatching)
    }

    func testStopMatching() async {
        viewModel.startMatching()
        viewModel.stopMatching()
        XCTAssertFalse(viewModel.isMatching)
    }

    func testTemplateImage() async {
        let template = ImageTemplate(
            imageId: "test-id",
            name: "Test Template",
            image: NSImage(),
            matchThreshold: 0.85,
            maxRetries: 3,
            interval: 1000,
            region: nil
        )
        viewModel.addTemplate(template)
        XCTAssertEqual(viewModel.templates.count, 1)
        XCTAssertEqual(viewModel.templates.first?.name, "Test Template")
    }
}
