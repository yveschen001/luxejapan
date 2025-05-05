import AppKit
import CoreGraphics
import Foundation
import Vision

extension ImageRecognitionService {
    /// 使用 ScreenCaptureKit 取得螢幕截圖
    private func captureScreenImage() async throws -> CGImage? {
        try await ModernScreenCaptureService.shared.captureMainDisplayImage()
    }

    /// 尋找模板匹配
    func findMatch(template: NSImage, threshold: Float = 0.85, region: CGRect? = nil) async throws -> ImageMatchResult {
        guard let screen = try await captureScreenImage(),
              let templateCG = template.cgImage(forProposedRect: nil, context: nil, hints: nil)
        else {
            throw ImageRecognitionError.captureError
        }
        if let matchPoint = try await matchTemplate(screen: screen, template: templateCG, threshold: threshold) {
            return ImageMatchResult(template: ImageTemplate(imageId: "", name: "Match", image: NSImage(), matchThreshold: threshold, maxRetries: 0, interval: 1, region: region ?? CGRect.zero), confidence: threshold, location: CGRect(origin: matchPoint, size: CGSize(width: 1, height: 1)))
        }
        throw ImageRecognitionError.noMatch
    }

    /// 單一模板識別並自動點擊
    @discardableResult
    func detectAndClick(for imageId: String, matchThreshold: Float = 0.85, maxRetries: Int = 3, region _: CGRect? = nil) async -> Bool {
        let templateURL = imagePath.appendingPathComponent("\(imageId).png")
        guard let template = NSImage(contentsOf: templateURL)?.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
            print("[ERROR] 模板圖像載入失敗：\(imageId)")
            return false
        }
        for attempt in 1 ... maxRetries {
            guard let screen = try? await captureScreenImage() else { continue }
            if let matchPoint = try? await matchTemplate(screen: screen, template: template, threshold: matchThreshold) {
                let clickPoint = matchPoint
                let result = accessibilityService.sendClick(at: clickPoint)
                if !result {
                    print("[ERROR] 點擊動作失敗：\(clickPoint)")
                }
                return result
            } else {
                print("[WARNING] 第 \(attempt) 次比對失敗，重試中...")
            }
        }
        print("[ERROR] 模板比對失敗：\(imageId)")
        return false
    }

    /// 多模板依序識別與自動點擊
    func detectMultiple(images: [ImageTemplate], interval: Int = 500) async {
        for template in images {
            let success = await detectAndClick(for: template.imageId, matchThreshold: template.matchThreshold, maxRetries: template.maxRetries, region: template.region)
            if !success {
                print("[WARNING] 模板 \(template.imageId) 比對失敗，跳過")
            }
            try? await Task.sleep(nanoseconds: UInt64(interval) * 1_000_000)
        }
    }
} 