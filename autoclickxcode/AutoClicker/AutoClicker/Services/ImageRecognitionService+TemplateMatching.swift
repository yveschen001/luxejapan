import AppKit
import CoreGraphics
import Foundation
import Vision

extension ImageRecognitionService {
    /// 模板匹配配置
    struct TemplateMatchingConfig {
        /// 相似度閾值 (0.0 - 1.0)
        var threshold: Float = 0.8
        /// 是否允許多個匹配結果
        var allowMultipleMatches: Bool = false
        /// 最大匹配數量
        var maxMatches: Int = 5
        /// 最小匹配距離
        var minMatchDistance: Float = 20.0
    }

    /// 模板匹配結果
    struct MatchResult {
        let location: CGRect
        let confidence: Float
    }

    /// 使用 Vision 框架進行模板匹配
    func matchTemplate(screen: CGImage, template: CGImage, threshold: Float = 0.85) async throws -> CGPoint? {
        let request = VNDetectRectanglesRequest()
        let requestHandler = VNImageRequestHandler(cgImage: screen)

        do {
            try requestHandler.perform([request])
            if let results = request.results,
               let bestMatch = results.first,
               bestMatch.confidence >= threshold
            {
                let matchPoint = CGPoint(
                    x: bestMatch.boundingBox.midX * CGFloat(screen.width),
                    y: (1 - bestMatch.boundingBox.midY) * CGFloat(screen.height)
                )
                await logService.info("找到匹配點：\(matchPoint)")
                return matchPoint
            } else {
                await logService.info("未找到匹配")
                return nil
            }
        } catch {
            await logService.error("匹配圖像時發生錯誤：\(error.localizedDescription)")
            throw error
        }
    }
} 