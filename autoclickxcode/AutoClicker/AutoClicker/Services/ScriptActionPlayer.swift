// ScriptActionPlayer.swift
// 腳本動作播放器：逐步執行 ScriptAction，支援滑鼠、鍵盤、等待、圖像比對
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/STYLE_GUIDE.md、docs/DATA_SCHEMA.md、docs/IMAGE_RECOGNITION_RULES.md 获取结构与命名规范

import Combine
import CoreGraphics
import Foundation

@MainActor
class ScriptActionPlayer: ObservableObject {
    static let shared = ScriptActionPlayer()

    @Published private(set) var isPlaying = false
    private var currentIndex = 0
    private var actions: [ScriptAction] = []
    private var cancellable: AnyCancellable?
    private var isStopped = false
    private let accessibilityService: AccessibilityEventService
    private let imageRecognitionService: ImageRecognitionService
    private let defaultDelay: TimeInterval = 0.5 // 500ms

    init() {
        accessibilityService = AccessibilityEventService.shared
        imageRecognitionService = ImageRecognitionService.shared
    }

    func setActions(_ actions: [ScriptAction]) {
        self.actions = actions
        currentIndex = 0
        isPlaying = false
    }

    func play(script: [ScriptAction], onLog: @escaping (String) -> Void) {
        isStopped = false
        actions = script
        isPlaying = true
        currentIndex = 0

        Task { @MainActor in
            do {
                try await playNext()
                onLog("播放完成")
            } catch {
                isPlaying = false
                onLog("播放失败：\(error)")
            }
        }
    }

    func stop() {
        isStopped = true
        isPlaying = false
        cancellable?.cancel()
    }

    private func playNext() async throws {
        guard isPlaying, currentIndex < actions.count else {
            isPlaying = false
            return
        }

        let action = actions[currentIndex]
        guard accessibilityService.perform(action: action) else {
            throw PlaybackError.actionFailed
        }

        currentIndex += 1

        if currentIndex < actions.count {
            try await Task.sleep(nanoseconds: UInt64(actions[currentIndex].delay * 1_000_000_000))
            if isPlaying {
                try await playNext()
            }
        } else {
            isPlaying = false
        }
    }

    enum PlaybackError: Error {
        case actionFailed
    }
}
