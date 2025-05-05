import AppKit
import CoreGraphics
import Foundation

extension ImageRecognitionService {
    /// 顏色匹配配置
    struct ColorMatchingConfig {
        /// 顏色容差 (0.0 - 1.0)
        var tolerance: Float = 0.1
        /// 是否允許多個匹配結果
        var allowMultipleMatches: Bool = true
        /// 最大匹配數量
        var maxMatches: Int = 100
    }

    /// 顏色匹配結果
    struct ColorMatchResult {
        let points: [CGPoint]
        let confidence: Float
    }

    /// 在圖像中查找指定顏色
    func findColor(_ targetColor: CGColor, in screenImage: CGImage, tolerance: Float = 0.1) async throws -> [CGPoint] {
        let width = screenImage.width
        let height = screenImage.height
        let bytesPerPixel = 4
        let bytesPerRow = width * bytesPerPixel
        let bitsPerComponent = 8

        guard let context = CGContext(
            data: nil,
            width: width,
            height: height,
            bitsPerComponent: bitsPerComponent,
            bytesPerRow: bytesPerRow,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else {
            throw ImageRecognitionError.contextCreationFailed
        }

        context.draw(screenImage, in: CGRect(x: 0, y: 0, width: width, height: height))

        guard let data = context.data else {
            throw ImageRecognitionError.noImageData
        }

        let buffer = data.assumingMemoryBound(to: UInt8.self)
        var matchPoints: [CGPoint] = []

        let targetComponents = targetColor.components ?? []
        guard targetComponents.count >= 3 else {
            throw ImageRecognitionError.invalidColor
        }

        for y in 0 ..< height {
            for x in 0 ..< width {
                let offset = (y * bytesPerRow) + (x * bytesPerPixel)
                let r = Float(buffer[offset]) / 255.0
                let g = Float(buffer[offset + 1]) / 255.0
                let b = Float(buffer[offset + 2]) / 255.0

                if abs(r - Float(targetComponents[0])) <= tolerance,
                   abs(g - Float(targetComponents[1])) <= tolerance,
                   abs(b - Float(targetComponents[2])) <= tolerance
                {
                    matchPoints.append(CGPoint(x: x, y: y))
                }
            }
        }

        await logService.info("找到 \(matchPoints.count) 個顏色匹配點")

        return matchPoints
    }
} 