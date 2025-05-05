// AccessibilityEventService.swift
// 輔助功能事件服務：模擬滑鼠點擊與鍵盤輸入，符合 docs/SECURITY_POLICY.md、docs/SPEC.md
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/STYLE_GUIDE.md 获取结构与命名规范

import AppKit
import ApplicationServices
import CoreGraphics
import Foundation

/// 輔助功能事件服務，負責模擬滑鼠與鍵盤事件
@MainActor
class AccessibilityEventService {
    static let shared = AccessibilityEventService()
    private let logService = LogService.shared

    private init() {
        checkAccessibilityPermission()
    }

    private func checkAccessibilityPermission() {
        let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true]
        let accessEnabled = AXIsProcessTrustedWithOptions(options as CFDictionary)

        Task {
            if accessEnabled {
                await logService.info("已獲得輔助功能權限")
            } else {
                await logService.warning("未獲得輔助功能權限，部分功能可能無法使用")
            }
        }
    }

    /// 模擬滑鼠點擊
    /// - Parameter point: 點擊座標
    /// - Returns: 是否成功
    func sendClick(at point: CGPoint) -> Bool {
        let source = CGEventSource(stateID: .hidSystemState)

        guard let mouseDown = CGEvent(mouseEventSource: source, mouseType: .leftMouseDown, mouseCursorPosition: point, mouseButton: .left),
              let mouseUp = CGEvent(mouseEventSource: source, mouseType: .leftMouseUp, mouseCursorPosition: point, mouseButton: .left)
        else {
            Task {
                await logService.error("創建點擊事件失敗")
            }
            return false
        }

        mouseDown.post(tap: .cghidEventTap)
        mouseUp.post(tap: .cghidEventTap)

        Task {
            await logService.info("發送點擊事件：\(point)")
        }

        return true
    }

    /// 模擬滑鼠雙擊
    /// - Parameter point: 點擊座標
    /// - Returns: 是否成功
    func sendDoubleClick(at point: CGPoint) -> Bool {
        let source = CGEventSource(stateID: .hidSystemState)

        guard let mouseDown1 = CGEvent(mouseEventSource: source, mouseType: .leftMouseDown, mouseCursorPosition: point, mouseButton: .left),
              let mouseUp1 = CGEvent(mouseEventSource: source, mouseType: .leftMouseUp, mouseCursorPosition: point, mouseButton: .left),
              let mouseDown2 = CGEvent(mouseEventSource: source, mouseType: .leftMouseDown, mouseCursorPosition: point, mouseButton: .left),
              let mouseUp2 = CGEvent(mouseEventSource: source, mouseType: .leftMouseUp, mouseCursorPosition: point, mouseButton: .left)
        else {
            Task {
                await logService.error("創建雙擊事件失敗")
            }
            return false
        }

        mouseDown1.post(tap: .cghidEventTap)
        mouseUp1.post(tap: .cghidEventTap)
        mouseDown2.post(tap: .cghidEventTap)
        mouseUp2.post(tap: .cghidEventTap)

        Task {
            await logService.info("發送雙擊事件：\(point)")
        }

        return true
    }

    /// 模擬滑鼠右鍵點擊
    /// - Parameter point: 點擊座標
    /// - Returns: 是否成功
    func sendRightClick(at point: CGPoint) -> Bool {
        let source = CGEventSource(stateID: .hidSystemState)

        guard let mouseDown = CGEvent(mouseEventSource: source, mouseType: .rightMouseDown, mouseCursorPosition: point, mouseButton: .right),
              let mouseUp = CGEvent(mouseEventSource: source, mouseType: .rightMouseUp, mouseCursorPosition: point, mouseButton: .right)
        else {
            Task {
                await logService.error("創建右鍵點擊事件失敗")
            }
            return false
        }

        mouseDown.post(tap: .cghidEventTap)
        mouseUp.post(tap: .cghidEventTap)

        Task {
            await logService.info("發送右鍵點擊事件：\(point)")
        }

        return true
    }

    /// 模擬滑鼠拖拽
    /// - Parameters:
    ///   - start: 起始點
    ///   - end: 終點
    ///   - duration: 拖拽持續時間，默認為0.5秒
    /// - Returns: 是否成功
    func sendDrag(from start: CGPoint, to end: CGPoint, duration: TimeInterval = 0.5) -> Bool {
        let source = CGEventSource(stateID: .hidSystemState)

        guard let mouseDown = CGEvent(mouseEventSource: source, mouseType: .leftMouseDown, mouseCursorPosition: start, mouseButton: .left),
              let mouseDrag = CGEvent(mouseEventSource: source, mouseType: .leftMouseDragged, mouseCursorPosition: end, mouseButton: .left),
              let mouseUp = CGEvent(mouseEventSource: source, mouseType: .leftMouseUp, mouseCursorPosition: end, mouseButton: .left)
        else {
            Task {
                await logService.error("創建拖拽事件失敗")
            }
            return false
        }

        mouseDown.post(tap: .cghidEventTap)

        // 平滑移动
        let steps = Int(duration * 60) // 60fps
        for i in 0 ... steps {
            let progress = Double(i) / Double(steps)
            let x = start.x + (end.x - start.x) * progress
            let y = start.y + (end.y - start.y) * progress
            mouseDrag.location = CGPoint(x: x, y: y)
            mouseDrag.post(tap: .cghidEventTap)
            Thread.sleep(forTimeInterval: duration / Double(steps))
        }

        mouseUp.post(tap: .cghidEventTap)

        Task {
            await logService.info("發送拖拽事件：從 \(start) 到 \(end)")
        }

        return true
    }

    /// 模擬鍵盤按鍵
    /// - Parameter key: 鍵盤 key
    /// - Parameter modifiers: 鍵盤修飾鍵
    /// - Returns: 是否成功
    func sendKeyPress(_ key: CGKeyCode, modifiers: CGEventFlags = []) -> Bool {
        let source = CGEventSource(stateID: .hidSystemState)

        guard let keyDown = CGEvent(keyboardEventSource: source, virtualKey: key, keyDown: true),
              let keyUp = CGEvent(keyboardEventSource: source, virtualKey: key, keyDown: false)
        else {
            Task {
                await logService.error("創建按鍵事件失敗")
            }
            return false
        }

        keyDown.flags = modifiers
        keyUp.flags = modifiers

        keyDown.post(tap: .cghidEventTap)
        keyUp.post(tap: .cghidEventTap)

        Task {
            await logService.info("發送按鍵事件：\(key) 修飾鍵：\(modifiers)")
        }

        return true
    }

    /// 輸入文本
    /// - Parameter text: 要輸入的文本
    /// - Returns: 是否成功
    func sendText(_ text: String) -> Bool {
        for char in text {
            guard let keyCode = char.keyCode else { continue }
            if !sendKeyPress(keyCode) {
                return false
            }
            Thread.sleep(forTimeInterval: 0.05)
        }
        return true
    }

    /// 批次執行腳本動作序列
    /// - Parameter actions: ScriptAction 陣列
    /// - Returns: 是否全部成功
    @discardableResult
    func sendSequence(_ actions: [ScriptAction]) async -> Bool {
        guard hasAccessibilityPermission() else {
            print("[ERROR] 無輔助功能權限，無法執行腳本序列")
            return false
        }
        var allSuccess = true
        do {
            for action in actions {
                switch action.type {
                case .click:
                    let result = sendClick(at: action.position)
                    allSuccess = allSuccess && result
                case .keyPress:
                    if let keyCode = action.keyCode {
                        let result = sendKeyPress(keyCode)
                        allSuccess = allSuccess && result
                    } else {
                        print("[ERROR] 缺少 keyCode，無法執行鍵盤事件")
                        allSuccess = false
                    }
                default:
                    print("[WARNING] 不支援的動作類型：\(action.type)")
                    allSuccess = false
                }
                // 延遲處理
                if action.delay > 0 {
                    try await Task.sleep(nanoseconds: UInt64(action.delay * 1_000_000_000))
                }
            }
            return allSuccess
        } catch {
            print("[ERROR] 腳本序列執行異常：\(error)")
            return false
        }
    }

    /// 統一腳本動作執行入口
    func perform(action: ScriptAction) -> Bool {
        guard hasAccessibilityPermission() else {
            print("[ERROR] 無輔助功能權限，無法執行動作")
            return false
        }

        switch action.type {
        case .click:
            return sendClick(at: action.position)
        case .keyPress:
            if let keyCode = action.keyCode {
                return sendKeyPress(keyCode)
            } else {
                print("[ERROR] 缺少 keyCode，無法執行鍵盤事件")
                return false
            }
        default:
            print("[WARNING] 不支援的動作類型：\(action.type)")
            return false
        }
    }
}

enum AccessibilityError: Error {
    case eventCreationFailed
    case clickFailed
    case keyPressFailed
    case unsupportedAction
}

// MARK: - Character Extension

extension Character {
    var keyCode: CGKeyCode? {
        let keyMap: [Character: CGKeyCode] = [
            "a": 0x00, "s": 0x01, "d": 0x02, "f": 0x03,
            "h": 0x04, "g": 0x05, "z": 0x06, "x": 0x07,
            "c": 0x08, "v": 0x09, "b": 0x0B, "q": 0x0C,
            "w": 0x0D, "e": 0x0E, "r": 0x0F, "y": 0x10,
            "t": 0x11, "1": 0x12, "2": 0x13, "3": 0x14,
            "4": 0x15, "6": 0x16, "5": 0x17, "=": 0x18,
            "9": 0x19, "7": 0x1A, "-": 0x1B, "8": 0x1C,
            "0": 0x1D, "]": 0x1E, "o": 0x1F, "u": 0x20,
            "[": 0x21, "i": 0x22, "p": 0x23, "l": 0x25,
            "j": 0x26, "'": 0x27, "k": 0x28, ";": 0x29,
            "\\": 0x2A, ",": 0x2B, "/": 0x2C, "n": 0x2D,
            "m": 0x2E, ".": 0x2F, "`": 0x32, " ": 0x31,
            "\n": 0x24, "\t": 0x30,
        ]
        return keyMap[lowercased().first ?? self]
    }
}
