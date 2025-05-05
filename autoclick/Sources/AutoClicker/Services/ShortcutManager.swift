import AppKit
import Carbon
import Foundation

/// 快捷鍵管理服務
class ShortcutManager {
    /// 單例
    static let shared = ShortcutManager()

    /// 快捷鍵配置
    struct ShortcutConfig: Codable, Equatable {
        /// 按鍵代碼
        var keyCode: Int
        /// 修飾鍵
        var modifiers: UInt
        /// 功能描述
        var action: String
        /// 是否啟用
        var isEnabled: Bool = true
    }

    /// 快捷鍵衝突
    struct ShortcutConflict: Error {
        /// 衝突的快捷鍵配置
        let shortcut: ShortcutConfig
        /// 衝突類型
        let type: ConflictType
        /// 建議解決方案
        let suggestion: String

        /// 衝突類型
        enum ConflictType {
            case system
            case application
            case reserved
        }

        var localizedDescription: String {
            suggestion
        }
    }

    /// 已註冊的快捷鍵
    private var registeredShortcuts: [String: ShortcutConfig] = [:]

    /// 系統保留的快捷鍵
    private let reservedShortcuts: Set<Int> = [
        // Command + Q (退出)
        12,
        // Command + W (關閉窗口)
        13,
        // Command + M (最小化)
        46,
        // Command + H (隱藏)
        4,
    ]

    /// 初始化
    private init() {
        loadShortcuts()
    }

    /// 註冊快捷鍵
    /// - Parameters:
    ///   - shortcut: 快捷鍵配置
    ///   - identifier: 快捷鍵標識符
    /// - Returns: 註冊結果，如果有衝突則返回衝突信息
    func registerShortcut(_ shortcut: ShortcutConfig, identifier: String) -> Result<Void, ShortcutConflict> {
        // 檢查衝突
        if let conflict = checkConflict(shortcut) {
            return .failure(conflict)
        }

        // 註冊快捷鍵
        let eventHotKey = registerHotKey(shortcut)
        if eventHotKey != nil {
            registeredShortcuts[identifier] = shortcut
            saveShortcuts()
            return .success(())
        } else {
            return .failure(ShortcutConflict(
                shortcut: shortcut,
                type: .system,
                suggestion: "無法註冊該快捷鍵，請嘗試其他組合"
            ))
        }
    }

    /// 取消註冊快捷鍵
    /// - Parameter identifier: 快捷鍵標識符
    func unregisterShortcut(identifier: String) {
        if let shortcut = registeredShortcuts[identifier] {
            unregisterHotKey(shortcut)
            registeredShortcuts.removeValue(forKey: identifier)
            saveShortcuts()
        }
    }

    /// 檢查快捷鍵衝突
    /// - Parameter shortcut: 要檢查的快捷鍵配置
    /// - Returns: 如果有衝突則返回衝突信息，否則返回 nil
    private func checkConflict(_ shortcut: ShortcutConfig) -> ShortcutConflict? {
        // 檢查系統保留快捷鍵
        if reservedShortcuts.contains(shortcut.keyCode),
           (shortcut.modifiers & NSEvent.ModifierFlags.command.rawValue) != 0
        {
            return ShortcutConflict(
                shortcut: shortcut,
                type: .reserved,
                suggestion: "這是系統保留的快捷鍵，請選擇其他組合"
            )
        }

        // 檢查已註冊的快捷鍵
        for (_, registered) in registeredShortcuts {
            if registered.keyCode == shortcut.keyCode,
               registered.modifiers == shortcut.modifiers
            {
                return ShortcutConflict(
                    shortcut: shortcut,
                    type: .application,
                    suggestion: "該快捷鍵已被使用，請選擇其他組合"
                )
            }
        }

        // 檢查系統快捷鍵
        if isSystemShortcut(shortcut) {
            return ShortcutConflict(
                shortcut: shortcut,
                type: .system,
                suggestion: "這可能與系統快捷鍵衝突，建議使用其他組合"
            )
        }

        return nil
    }

    /// 檢查是否是系統快捷鍵
    /// - Parameter shortcut: 要檢查的快捷鍵配置
    /// - Returns: 是否是系統快捷鍵
    private func isSystemShortcut(_ shortcut: ShortcutConfig) -> Bool {
        // 獲取系統快捷鍵
        guard let systemShortcuts = UserDefaults.standard.persistentDomain(forName: "com.apple.symbolichotkeys")?["AppleSymbolicHotKeys"] as? [String: Any] else {
            return false
        }

        // 檢查是否與系統快捷鍵衝突
        for (_, value) in systemShortcuts {
            guard let dict = value as? [String: Any],
                  let enabled = dict["enabled"] as? Bool,
                  enabled,
                  let value = dict["value"] as? [String: Any],
                  let parameters = value["parameters"] as? [Any],
                  parameters.count >= 3,
                  let keyCode = parameters[1] as? Int,
                  let modifiers = parameters[2] as? UInt
            else {
                continue
            }

            if keyCode == shortcut.keyCode, modifiers == shortcut.modifiers {
                return true
            }
        }

        return false
    }

    /// 註冊系統熱鍵
    /// - Parameter shortcut: 快捷鍵配置
    /// - Returns: 事件熱鍵 ID，如果註冊失敗則返回 nil
    private func registerHotKey(_ shortcut: ShortcutConfig) -> EventHotKeyRef? {
        var hotKeyRef: EventHotKeyRef?
        var hotKeyID = EventHotKeyID()

        hotKeyID.signature = OSType(shortcut.keyCode)
        hotKeyID.id = UInt32(shortcut.modifiers)

        let status = RegisterEventHotKey(
            UInt32(shortcut.keyCode),
            UInt32(shortcut.modifiers),
            hotKeyID,
            GetEventDispatcherTarget(),
            0,
            &hotKeyRef
        )

        return status == noErr ? hotKeyRef : nil
    }

    /// 取消註冊系統熱鍵
    /// - Parameter shortcut: 快捷鍵配置
    private func unregisterHotKey(_ shortcut: ShortcutConfig) {
        var hotKeyRef: EventHotKeyRef?
        var hotKeyID = EventHotKeyID()

        hotKeyID.signature = OSType(shortcut.keyCode)
        hotKeyID.id = UInt32(shortcut.modifiers)

        if RegisterEventHotKey(
            UInt32(shortcut.keyCode),
            UInt32(shortcut.modifiers),
            hotKeyID,
            GetEventDispatcherTarget(),
            0,
            &hotKeyRef
        ) == noErr {
            if let hotKeyRef {
                UnregisterEventHotKey(hotKeyRef)
            }
        }
    }

    /// 保存快捷鍵配置
    private func saveShortcuts() {
        let encoder = JSONEncoder()
        if let data = try? encoder.encode(registeredShortcuts) {
            UserDefaults.standard.set(data, forKey: "RegisteredShortcuts")
        }
    }

    /// 加載快捷鍵配置
    private func loadShortcuts() {
        let decoder = JSONDecoder()
        if let data = UserDefaults.standard.data(forKey: "RegisteredShortcuts"),
           let shortcuts = try? decoder.decode([String: ShortcutConfig].self, from: data)
        {
            registeredShortcuts = shortcuts
        }
    }

    /// 獲取所有註冊的快捷鍵
    /// - Returns: 快捷鍵配置字典
    func getAllShortcuts() -> [String: ShortcutConfig] {
        registeredShortcuts
    }

    /// 更新快捷鍵配置
    /// - Parameters:
    ///   - shortcut: 新的快捷鍵配置
    ///   - identifier: 快捷鍵標識符
    /// - Returns: 更新結果，如果有衝突則返回衝突信息
    func updateShortcut(_ shortcut: ShortcutConfig, identifier: String) -> Result<Void, ShortcutConflict> {
        // 先取消註冊舊的快捷鍵
        unregisterShortcut(identifier: identifier)

        // 註冊新的快捷鍵
        return registerShortcut(shortcut, identifier: identifier)
    }

    /// 禁用快捷鍵
    /// - Parameter identifier: 快捷鍵標識符
    func disableShortcut(identifier: String) {
        if var shortcut = registeredShortcuts[identifier] {
            unregisterHotKey(shortcut)
            shortcut.isEnabled = false
            registeredShortcuts[identifier] = shortcut
            saveShortcuts()
        }
    }

    /// 啟用快捷鍵
    /// - Parameter identifier: 快捷鍵標識符
    /// - Returns: 啟用結果，如果有衝突則返回衝突信息
    func enableShortcut(identifier: String) -> Result<Void, ShortcutConflict> {
        if var shortcut = registeredShortcuts[identifier] {
            shortcut.isEnabled = true
            return updateShortcut(shortcut, identifier: identifier)
        }
        return .success(())
    }

    /// 重置所有快捷鍵
    func resetAllShortcuts() {
        for (identifier, _) in registeredShortcuts {
            unregisterShortcut(identifier: identifier)
        }
        registeredShortcuts.removeAll()
        saveShortcuts()
    }

    /// 獲取快捷鍵顯示文本
    /// - Parameter shortcut: 快捷鍵配置
    /// - Returns: 顯示文本
    func getShortcutDisplayText(_ shortcut: ShortcutConfig) -> String {
        var components: [String] = []
        let modifiers = shortcut.modifiers

        if (modifiers & NSEvent.ModifierFlags.command.rawValue) != 0 {
            components.append("⌘")
        }
        if (modifiers & NSEvent.ModifierFlags.option.rawValue) != 0 {
            components.append("⌥")
        }
        if (modifiers & NSEvent.ModifierFlags.shift.rawValue) != 0 {
            components.append("⇧")
        }
        if (modifiers & NSEvent.ModifierFlags.control.rawValue) != 0 {
            components.append("⌃")
        }

        if let keyChar = keyCodeToChar(shortcut.keyCode) {
            components.append(keyChar)
        }

        return components.joined(separator: "")
    }

    /// 按鍵代碼轉字符
    /// - Parameter keyCode: 按鍵代碼
    /// - Returns: 字符
    private func keyCodeToChar(_ keyCode: Int) -> String? {
        let keyMap: [Int: String] = [
            0: "A", 1: "S", 2: "D", 3: "F", 4: "H", 5: "G", 6: "Z", 7: "X",
            8: "C", 9: "V", 11: "B", 12: "Q", 13: "W", 14: "E", 15: "R",
            16: "Y", 17: "T", 32: "U", 34: "I", 31: "O", 35: "P", 37: "L",
            38: "J", 40: "K", 45: "N", 46: "M"
        ]
        return keyMap[keyCode]
    }
}
