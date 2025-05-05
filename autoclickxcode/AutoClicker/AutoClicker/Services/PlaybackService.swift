import AppKit
import Combine
import CoreGraphics
import Foundation

@MainActor
class PlaybackService: ObservableObject {
    static let shared = PlaybackService()

    @Published private(set) var isPlaying = false
    @Published private(set) var currentScript: Script?
    @Published private(set) var currentActionIndex = 0
    @Published private(set) var currentRepeatCount = 0

    private let logService = LogService.shared
    private let accessibilityService = AccessibilityEventService.shared
    private let mouseService = MouseService.shared
    private var playbackTask: Task<Void, Error>?

    private init() {}

    func startPlaying(_ script: Script? = nil) async throws {
        guard !isPlaying else {
            await logService.warning("播放已在進行中")
            return
        }

        if let script {
            currentScript = script
        }

        guard let script = currentScript, !script.actions.isEmpty else {
            throw PlaybackError.noScript
        }

        isPlaying = true
        currentActionIndex = 0
        currentRepeatCount = 0

        playbackTask = Task {
            do {
                try await playScript(script)
            } catch {
                await logService.error("播放腳本時發生錯誤：\(error.localizedDescription)")
                throw error
            }
        }

        await logService.info("開始播放腳本：\(script.name)")
    }

    func stopPlaying() async throws {
        guard isPlaying else {
            await logService.warning("沒有正在進行的播放")
            return
        }

        playbackTask?.cancel()
        playbackTask = nil
        isPlaying = false
        currentScript = nil
        currentActionIndex = 0
        currentRepeatCount = 0

        await logService.info("停止播放腳本")
    }

    private func playScript(_ script: Script) async throws {
        repeat {
            currentRepeatCount += 1

            for (index, action) in script.actions.enumerated() {
                guard isPlaying else { return }

                currentActionIndex = index
                try await playAction(action)

                // 等待指定间隔
                if index < script.actions.count - 1 {
                    try await Task.sleep(nanoseconds: UInt64(script.interval * 1_000_000_000))
                }
            }

            await logService.info("完成第 \(currentRepeatCount) 次播放")

        } while script.repeatCount == 0 || currentRepeatCount < script.repeatCount

        isPlaying = false
        await logService.info("腳本播放完成")
    }

    private func playAction(_ action: ScriptAction) async throws {
        switch action.type {
        case .click:
            guard let point = action.point else {
                throw PlaybackError.invalidAction
            }
            mouseService.click(at: point)
            await logService.info("執行點擊：\(point)")

        case .doubleClick:
            guard let point = action.point else {
                throw PlaybackError.invalidAction
            }
            mouseService.doubleClick(at: point)
            await logService.info("執行雙擊：\(point)")

        case .rightClick:
            guard let point = action.point else {
                throw PlaybackError.invalidAction
            }
            mouseService.rightClick(at: point)
            await logService.info("執行右鍵點擊：\(point)")

        case .drag:
            guard let point = action.point,
                  let duration = action.duration
            else {
                throw PlaybackError.invalidAction
            }
            let currentPos = NSEvent.mouseLocation
            mouseService.drag(from: currentPos, to: point, duration: duration)
            await logService.info("執行拖拽：從 \(currentPos) 到 \(point)")

        case .keyPress:
            guard let key = action.key else {
                throw PlaybackError.invalidAction
            }
            if !accessibilityService.sendText(key) {
                throw PlaybackError.actionFailed
            }
            await logService.info("執行按鍵：\(key)")

        case .wait:
            guard let duration = action.duration else {
                throw PlaybackError.invalidAction
            }
            try await Task.sleep(nanoseconds: UInt64(duration * 1_000_000_000))
            await logService.info("等待：\(duration) 秒")

        case .imageMatch:
            throw PlaybackError.invalidAction // 暫時不支持圖像識別
        }
    }

    func getCurrentScript() -> Script? {
        currentScript
    }

    func setCurrentScript(_ script: Script) {
        currentScript = script
    }

    func clearCurrentScript() {
        currentScript = nil
    }
}

enum PlaybackError: Error {
    case noScript
    case invalidAction
    case actionFailed

    var localizedDescription: String {
        switch self {
        case .noScript:
            "沒有可播放的腳本"
        case .invalidAction:
            "無效的動作"
        case .actionFailed:
            "動作執行失敗"
        }
    }
}
