// ModernScreenCaptureService.swift
// 使用 ScreenCaptureKit 進行屏幕截圖的現代服務
// 注意：這是唯一允許使用的截圖服務，禁止使用 CGWindowListCreateImage 或 captureScreen

import AppKit
import AVFoundation
import CoreGraphics
import Foundation
import ScreenCaptureKit

/// 現代屏幕截圖服務
/// 使用 ScreenCaptureKit 進行高效、安全的屏幕截圖
/// 這是唯一允許使用的截圖服務，禁止使用其他截圖方法
@MainActor
class ModernScreenCaptureService {
    /// 共享實例
    static let shared = ModernScreenCaptureService()

    private let logService = LogService.shared

    private var filter: SCContentFilter?
    private var stream: SCStream?
    private var streamConfiguration: SCStreamConfiguration?
    private var lastFrame: CGImage?

    private init() {
        Task {
            await setupScreenCapture()
        }
    }

    private func setupScreenCapture() async {
        do {
            // 获取主显示器
            guard let display = try await SCShareableContent.current.displays.first else {
                await logService.error("無法獲取主顯示器")
                return
            }

            // 创建过滤器
            filter = SCContentFilter(display: display, excludingApplications: [], exceptingWindows: [])

            // 配置流
            streamConfiguration = SCStreamConfiguration()
            streamConfiguration?.width = display.width
            streamConfiguration?.height = display.height
            streamConfiguration?.minimumFrameInterval = CMTime(value: 1, timescale: 60)
            streamConfiguration?.queueDepth = 1

            await logService.info("螢幕捕獲服務初始化完成")
        } catch {
            await logService.error("初始化螢幕捕獲服務失敗：\(error.localizedDescription)")
        }
    }

    /// 截取主顯示器的圖像
    /// - Returns: 截取的圖像，如果失敗則返回 nil
    /// - Throws: 如果截圖過程中發生錯誤
    func captureMainDisplayImage() async throws -> CGImage? {
        guard let filter, let streamConfiguration else {
            throw ScreenCaptureError.notInitialized
        }

        // 创建流
        stream = SCStream(filter: filter, configuration: streamConfiguration, delegate: nil)

        // 创建帧处理器
        let handler = SCStreamOutputHandler { [weak self] _, sampleBuffer in
            guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
            let ciImage = CIImage(cvImageBuffer: imageBuffer)
            let context = CIContext()
            if let cgImage = context.createCGImage(ciImage, from: ciImage.extent) {
                self?.lastFrame = cgImage
            }
        }

        // 添加帧处理器
        try stream?.addStreamOutput(handler, type: .screen, sampleHandlerQueue: .main)

        // 启动流
        try await stream?.startCapture()

        // 等待一帧
        try await Task.sleep(nanoseconds: UInt64(1.0 / 60.0 * 1_000_000_000))

        // 停止流
        try await stream?.stopCapture()
        stream = nil

        return lastFrame
    }
}

enum ScreenCaptureError: Error {
    case notInitialized
    case captureError

    var localizedDescription: String {
        switch self {
        case .notInitialized:
            "螢幕捕獲服務未初始化"
        case .captureError:
            "捕獲螢幕圖像失敗"
        }
    }
}

// MARK: - SCStreamOutput Handler

class SCStreamOutputHandler: NSObject, SCStreamOutput {
    let frameHandler: (SCStream, CMSampleBuffer) -> Void

    init(frameHandler: @escaping (SCStream, CMSampleBuffer) -> Void) {
        self.frameHandler = frameHandler
    }

    func stream(_ stream: SCStream, didOutputSampleBuffer sampleBuffer: CMSampleBuffer, of type: SCStreamOutputType) {
        guard type == .screen else { return }
        frameHandler(stream, sampleBuffer)
    }
}

// MARK: - Frame Status Extension

extension SCFrameStatus {
    init?(sampleBuffer: CMSampleBuffer) {
        guard let attachments = CMSampleBufferGetSampleAttachmentsArray(sampleBuffer, createIfNecessary: false) as? [[SCStreamFrameInfo: Any]],
              let attachment = attachments.first,
              let statusRawValue = attachment[SCStreamFrameInfo.status] as? Int
        else { return nil }

        self.init(rawValue: statusRawValue)
    }
}

// MARK: - IOSurface Extension

extension IOSurface {
    func createImage() -> CGImage? {
        let width = IOSurfaceGetWidth(self)
        let height = IOSurfaceGetHeight(self)
        let bytesPerRow = IOSurfaceGetBytesPerRow(self)

        let context = CGContext(
            data: IOSurfaceGetBaseAddress(self),
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: bytesPerRow,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
        )

        return context?.makeImage()
    }
}
