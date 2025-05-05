// AutoClicker
// Copyright © 2024 Your Name. All rights reserved.
// Created by AI Assistant on 2024-05-02.

import Combine
import SwiftUI

@MainActor
class ImageMatchViewModel: ObservableObject {
    // MARK: - Properties

    @Published private(set) var isMatching = false
    @Published private(set) var matchCount = 0
    @Published private(set) var errorMessage: String?
    @Published private(set) var showError = false
    @Published var templateImage: CGImage?
    @Published var targetColor: CGColor?
    @Published var matchingThreshold: Float = 0.8
    @Published var colorTolerance: Float = 0.1

    private let imageRecognitionService: ImageRecognitionService
    private let logService: LogService
    private var matchingTask: Task<Void, Never>?

    // MARK: - Initialization

    init() {
        imageRecognitionService = ImageRecognitionService.shared
        logService = LogService.shared
    }

    // MARK: - Image Matching

    func startMatching() {
        guard !isMatching else { return }

        isMatching = true
        matchingTask = Task {
            do {
                while !Task.isCancelled {
                    if let templateImage {
                        imageRecognitionService.setTemplateImage(templateImage)
                        imageRecognitionService.setMatchingThreshold(matchingThreshold)

                        if let screenImage = try await captureScreen() {
                            if let matchPoint = try await imageRecognitionService.findMatch(in: screenImage) {
                                matchCount += 1
                                Task { @MainActor in
                                    await logService.info("找到匹配點：\(matchPoint)")
                                }
                            }
                        }
                    } else if let targetColor {
                        if let screenImage = try await captureScreen() {
                            let matchPoints = try await imageRecognitionService.findColor(
                                targetColor,
                                in: screenImage,
                                tolerance: colorTolerance
                            )
                            matchCount = matchPoints.count
                            Task { @MainActor in
                                await logService.info("找到 \(matchPoints.count) 個顏色匹配點")
                            }
                        }
                    }

                    try await Task.sleep(nanoseconds: 1_000_000_000) // 1秒
                }
            } catch {
                handleError(error)
            }

            isMatching = false
        }
    }

    func stopMatching() {
        matchingTask?.cancel()
        matchingTask = nil
        isMatching = false
        Task { @MainActor in
            await logService.info("停止匹配")
        }
    }

    // MARK: - Screen Capture

    private func captureScreen() async throws -> CGImage? {
        let displayID = CGMainDisplayID()
        guard let image = CGDisplayCreateImage(displayID) else {
            throw ImageRecognitionError.captureError
        }
        return image
    }

    // MARK: - Error Handling

    private func handleError(_ error: Error) {
        errorMessage = error.localizedDescription
        showError = true
        Task { @MainActor in
            await logService.error("圖像識別錯誤：\(error.localizedDescription)")
        }
    }

    // MARK: - Alert Handling

    func dismissError() {
        errorMessage = nil
        showError = false
    }
}

extension ImageMatchViewModel {
    static var mock: ImageMatchViewModel {
        let vm = ImageMatchViewModel()
        // 可填入假資料
        return vm
    }
}
