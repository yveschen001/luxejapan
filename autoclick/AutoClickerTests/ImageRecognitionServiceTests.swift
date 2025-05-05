// ImageRecognitionServiceTests.swift
// 單元測試：圖像識別服務
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 QA_AUTOCHECK.md、STYLE_GUIDE.md 获取測試結構與命名規範

@testable import AutoClicker
import CoreGraphics
import XCTest

@MainActor
final class ImageRecognitionServiceTests: XCTestCase {
    var service: ImageRecognitionService!

    override func setUp() async throws {
        super.setUp()
        service = ImageRecognitionService()
    }

    override func tearDown() async throws {
        service = nil
        super.tearDown()
    }

    func testBasicRecognition() async throws {
        // 准备测试数据
        let testImage = createTestImage()
        let template = createTemplateImage()

        // 设置模板
        service.setTemplateImage(template)

        // 执行测试
        let result = try await service.findMatch(in: testImage)

        // 验证结果
        XCTAssertNotNil(result)
    }

    func testTemplateMatching() async throws {
        // 准备测试数据
        let testImage = createTestImage()
        let template = createTemplateImage()

        // 设置模板
        service.setTemplateImage(template)

        // 执行测试
        let result = try await service.findMatch(in: testImage)

        // 验证结果
        XCTAssertNotNil(result)
    }

    func testColorRecognition() async throws {
        // 准备测试数据
        let testImage = createTestImage()
        let targetColor = CGColor(red: 1.0, green: 0.0, blue: 0.0, alpha: 1.0)

        // 执行测试
        let result = try await service.findColor(targetColor, in: testImage)

        // 验证结果
        XCTAssertFalse(result.isEmpty)
    }

    func testMultipleTemplates() async throws {
        // 准备测试数据
        let templates = [
            createTemplateImage(),
            createTemplateImage(),
            createTemplateImage(),
        ]

        // 设置模板
        for template in templates {
            service.setTemplateImage(template)
            let result = try await service.findMatch(in: createTestImage())
            XCTAssertNotNil(result)
        }
    }

    func testMatchingThreshold() async throws {
        // 准备测试数据
        let testImage = createTestImage()
        let template = createTemplateImage()

        // 设置模板
        service.setTemplateImage(template)

        // 测试不同阈值
        service.setMatchingThreshold(0.5)
        let result1 = try await service.findMatch(in: testImage)
        XCTAssertNotNil(result1)

        service.setMatchingThreshold(0.9)
        let result2 = try await service.findMatch(in: testImage)
        XCTAssertNotNil(result2)
    }

    func testErrorHandling() async {
        // 测试无模板图像的情况
        do {
            _ = try await service.findMatch(in: createTestImage())
            XCTFail("应该抛出错误")
        } catch ImageRecognitionError.noTemplateImage {
            // 预期错误
        } catch {
            XCTFail("错误的错误类型：\(error)")
        }

        // 测试无效颜色
        do {
            let invalidColor = CGColor(red: 2.0, green: 2.0, blue: 2.0, alpha: 1.0)
            _ = try await service.findColor(invalidColor, in: createTestImage())
            XCTFail("应该抛出错误")
        } catch ImageRecognitionError.invalidColor {
            // 预期错误
        } catch {
            XCTFail("错误的错误类型：\(error)")
        }
    }

    // 辅助方法
    private func createTestImage() -> CGImage {
        // 创建测试图像
        let size = CGSize(width: 100, height: 100)
        let context = CGContext(data: nil,
                                width: Int(size.width),
                                height: Int(size.height),
                                bitsPerComponent: 8,
                                bytesPerRow: 0,
                                space: CGColorSpaceCreateDeviceRGB(),
                                bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!

        // 绘制测试图案
        context.setFillColor(CGColor(red: 1.0, green: 0.0, blue: 0.0, alpha: 1.0))
        context.fill(CGRect(x: 0, y: 0, width: size.width, height: size.height))

        return context.makeImage()!
    }

    private func createTemplateImage() -> CGImage {
        // 创建模板图像
        let size = CGSize(width: 50, height: 50)
        let context = CGContext(data: nil,
                                width: Int(size.width),
                                height: Int(size.height),
                                bitsPerComponent: 8,
                                bytesPerRow: 0,
                                space: CGColorSpaceCreateDeviceRGB(),
                                bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!

        // 绘制模板图案
        context.setFillColor(CGColor(red: 1.0, green: 0.0, blue: 0.0, alpha: 1.0))
        context.fill(CGRect(x: 0, y: 0, width: size.width, height: size.height))

        return context.makeImage()!
    }

    // MARK: - 螢幕截圖測試

    func testCaptureScreenReturnsCGImage() {
        let service = MockImageRecognitionService(permission: true)
        let image = service.captureScreen(region: CGRect(x: 0, y: 0, width: 100, height: 100))
        XCTAssertNotNil(image, "應正確回傳 CGImage")
        XCTAssertEqual(service.lastCaptureRegion, CGRect(x: 0, y: 0, width: 100, height: 100), "應支援自訂掃描範圍")
    }

    // MARK: - 單一模板比對與點擊

    func testDetectAndClickWithValidImage() {
        let service = MockImageRecognitionService(permission: true)
        service.mockMatchSuccess = true
        let result = service.detectAndClick(for: "testImage")
        XCTAssertTrue(result, "存在圖片時應能正確判定與執行點擊")
        XCTAssertTrue(service.didClick, "應呼叫點擊動作")
    }

    // MARK: - 多模板依序比對與 interval 測試

    func testDetectMultipleExecutesInOrderWithInterval() {
        let service = MockImageRecognitionService(permission: true)
        service.mockMatchSuccess = true
        let templates = [
            ImageTemplate(imageId: "img1", matchThreshold: 0.85, maxRetries: 1, region: nil),
            ImageTemplate(imageId: "img2", matchThreshold: 0.85, maxRetries: 1, region: nil),
        ]
        let start = Date()
        service.detectMultiple(images: templates, interval: 200)
        let elapsed = Date().timeIntervalSince(start)
        XCTAssertTrue(service.detectedImageIds == ["img1", "img2"], "應依序執行每個模板")
        XCTAssertTrue(elapsed >= 0.2, "應有 interval 間隔")
    }

    // MARK: - 權限不足時安全失敗

    func testDetectAndClickWithoutScreenPermission() {
        let service = MockImageRecognitionService(permission: false)
        let result = service.detectAndClick(for: "testImage")
        XCTAssertFalse(result, "權限不足時應安全失敗")
        XCTAssertTrue(service.lastLog.contains("無螢幕錄製權限"), "應輸出權限不足 log")
    }

    // MARK: - 無效 imageId 或路徑

    func testDetectAndClickWithInvalidImageId() {
        let service = MockImageRecognitionService(permission: true)
        service.mockImageLoadSuccess = false
        let result = service.detectAndClick(for: "notExist")
        XCTAssertFalse(result, "無效 imageId 應安全失敗")
        XCTAssertTrue(service.lastLog.contains("模板圖像載入失敗"), "應輸出載入失敗 log")
    }
}

// MARK: - Mock Service for Testing

@MainActor
class MockImageRecognitionService: ImageRecognitionService {
    var mockMatchSuccess = false
    var mockImageLoadSuccess = true
    var didClick = false
    var lastLog = ""
    var lastCaptureRegion: CGRect?
    var detectedImageIds: [String] = []
    private let mockPermission: Bool

    init(permission: Bool) {
        mockPermission = permission
        super.init()
    }

    override func hasScreenRecordingPermission() -> Bool {
        mockPermission
    }

    override func captureScreen(region: CGRect? = nil) -> CGImage? {
        lastCaptureRegion = region
        guard mockPermission else {
            lastLog = "[ERROR] 無螢幕錄製權限，無法截圖"
            return nil
        }
        // 回傳 1x1 空白圖像
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        return CGContext(data: nil, width: 1, height: 1, bitsPerComponent: 8, bytesPerRow: 0, space: colorSpace, bitmapInfo: 0)?.makeImage()
    }

    override func detectAndClick(for imageId: String, matchThreshold _: Float = 0.85, maxRetries _: Int = 3, region _: CGRect? = nil) async -> Bool {
        detectedImageIds.append(imageId)
        guard mockPermission else {
            lastLog = "[ERROR] 無螢幕錄製權限，無法進行圖像識別"
            return false
        }
        guard mockImageLoadSuccess else {
            lastLog = "[ERROR] 模板圖像載入失敗：\(imageId)"
            return false
        }
        if mockMatchSuccess {
            didClick = true
            return true
        }
        return false
    }

    override func detectMultiple(images: [ImageTemplate], interval: Int = 500) {
        for template in images {
            _ = detectAndClick(for: template.imageId, matchThreshold: template.matchThreshold, maxRetries: template.maxRetries, region: template.region)
            Thread.sleep(forTimeInterval: Double(interval) / 1000)
        }
    }
}
