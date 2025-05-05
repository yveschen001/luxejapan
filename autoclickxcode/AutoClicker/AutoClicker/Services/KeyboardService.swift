import CoreGraphics
import Foundation

@MainActor
class KeyboardService {
    static let shared = KeyboardService()
    private let logService = LogService.shared

    private init() {}

    func pressKey(_ keyCode: UInt16) async throws {
        // 按下按鍵
        let event = CGEvent(keyboardEventSource: nil, virtualKey: keyCode, keyDown: true)
        event?.post(tap: .cghidEventTap)

        // 短暫延遲
        try await Task.sleep(nanoseconds: 100_000_000) // 100ms

        Task { @MainActor in
            await logService.info("按下按鍵：\(keyCode)")
        }
    }

    func releaseKey(_ keyCode: UInt16) async throws {
        // 釋放按鍵
        let event = CGEvent(keyboardEventSource: nil, virtualKey: keyCode, keyDown: false)
        event?.post(tap: .cghidEventTap)

        // 短暫延遲
        try await Task.sleep(nanoseconds: 100_000_000) // 100ms

        Task { @MainActor in
            await logService.info("釋放按鍵：\(keyCode)")
        }
    }
}
