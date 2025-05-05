import AppKit
import Foundation

/// 數據管理服務
class DataManager {
    /// 單例
    static let shared = DataManager()

    /// 數據類型
    enum DataType: String {
        case scripts = "腳本"
        case settings = "設置"
        case shortcuts = "快捷鍵"
        case templates = "模板"
    }

    /// 備份信息
    struct BackupInfo: Codable {
        /// 備份 ID
        let id: String
        /// 備份時間
        let timestamp: Date
        /// 備份描述
        let description: String
        /// 備份類型
        let types: [DataType]
        /// 版本號
        let version: String
    }

    /// 導出格式
    enum ExportFormat: String {
        case json = "JSON"
        case plist = "Plist"
        case xml = "XML"
    }

    /// 數據版本控制
    private var versions: [String: Date] = [:]

    /// 備份列表
    private var backups: [BackupInfo] = []

    /// 初始化
    private init() {
        loadVersions()
        loadBackups()
    }

    /// 創建備份
    /// - Parameters:
    ///   - types: 要備份的數據類型
    ///   - description: 備份描述
    /// - Returns: 備份信息
    func createBackup(types: [DataType], description: String) -> BackupInfo {
        // 創建備份 ID
        let id = UUID().uuidString

        // 創建備份目錄
        let backupDirectory = getBackupDirectory().appendingPathComponent(id)

        do {
            try FileManager.default.createDirectory(at: backupDirectory, withIntermediateDirectories: true)

            // 備份每種類型的數據
            for type in types {
                try backupData(type: type, to: backupDirectory)
            }

            // 創建備份信息
            let info = BackupInfo(
                id: id,
                timestamp: Date(),
                description: description,
                types: types,
                version: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0"
            )

            // 保存備份信息
            backups.append(info)
            saveBackups()

            return info
        } catch {
            print("創建備份失敗：\(error)")
            throw error
        }
    }

    /// 恢復備份
    /// - Parameter backup: 備份信息
    func restoreBackup(_ backup: BackupInfo) throws {
        let backupDirectory = getBackupDirectory().appendingPathComponent(backup.id)

        // 恢復每種類型的數據
        for type in backup.types {
            try restoreData(type: type, from: backupDirectory)
        }

        // 更新版本信息
        versions[backup.version] = backup.timestamp
        saveVersions()
    }

    /// 導出數據
    /// - Parameters:
    ///   - types: 要導出的數據類型
    ///   - format: 導出格式
    /// - Returns: 導出文件的 URL
    func exportData(types: [DataType], format: ExportFormat) throws -> URL {
        // 創建臨時目錄
        let tempDirectory = FileManager.default.temporaryDirectory
            .appendingPathComponent("AutoClickerExport")

        try FileManager.default.createDirectory(at: tempDirectory, withIntermediateDirectories: true)

        // 收集數據
        var exportData: [String: Any] = [:]

        for type in types {
            let data = try collectData(type: type)
            exportData[type.rawValue] = data
        }

        // 根據格式導出
        let exportFile: URL
        switch format {
        case .json:
            let jsonData = try JSONSerialization.data(withJSONObject: exportData, options: .prettyPrinted)
            exportFile = tempDirectory.appendingPathComponent("export.json")
            try jsonData.write(to: exportFile)

        case .plist:
            let plistData = try PropertyListSerialization.data(fromPropertyList: exportData, format: .xml, options: 0)
            exportFile = tempDirectory.appendingPathComponent("export.plist")
            try plistData.write(to: exportFile)

        case .xml:
            let xmlData = try PropertyListSerialization.data(fromPropertyList: exportData, format: .xml, options: 0)
            exportFile = tempDirectory.appendingPathComponent("export.xml")
            try xmlData.write(to: exportFile)
        }

        return exportFile
    }

    /// 導入數據
    /// - Parameters:
    ///   - url: 導入文件的 URL
    ///   - format: 導入格式
    func importData(from url: URL, format: ExportFormat) throws {
        // 讀取文件數據
        let data = try Data(contentsOf: url)

        // 根據格式解析
        let importData: [String: Any]
        switch format {
        case .json:
            importData = try JSONSerialization.jsonObject(with: data) as? [String: Any] ?? [:]

        case .plist, .xml:
            importData = try PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any] ?? [:]
        }

        // 導入每種類型的數據
        for (key, value) in importData {
            guard let type = DataType(rawValue: key) else { continue }
            try importData(type: type, data: value)
        }
    }

    /// 獲取備份列表
    /// - Returns: 備份信息數組
    func getBackups() -> [BackupInfo] {
        backups.sorted { $0.timestamp > $1.timestamp }
    }

    /// 刪除備份
    /// - Parameter backup: 備份信息
    func deleteBackup(_ backup: BackupInfo) {
        let backupDirectory = getBackupDirectory().appendingPathComponent(backup.id)

        try? FileManager.default.removeItem(at: backupDirectory)

        backups.removeAll { $0.id == backup.id }
        saveBackups()
    }

    /// 獲取版本歷史
    /// - Returns: 版本歷史字典
    func getVersionHistory() -> [String: Date] {
        versions
    }

    // MARK: - 私有方法

    /// 獲取備份目錄
    private func getBackupDirectory() -> URL {
        FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
            .appendingPathComponent("AutoClicker/Backups")
    }

    /// 備份數據
    private func backupData(type: DataType, to directory: URL) throws {
        let data = try collectData(type: type)
        let file = directory.appendingPathComponent("\(type.rawValue).json")
        let jsonData = try JSONSerialization.data(withJSONObject: data, options: .prettyPrinted)
        try jsonData.write(to: file)
    }

    /// 恢復數據
    private func restoreData(type: DataType, from directory: URL) throws {
        let file = directory.appendingPathComponent("\(type.rawValue).json")
        let data = try Data(contentsOf: file)
        let json = try JSONSerialization.jsonObject(with: data)
        try importData(type: type, data: json)
    }

    /// 收集數據
    private func collectData(type: DataType) throws -> Any {
        switch type {
        case .scripts:
            // 收集腳本數據
            try collectScripts()

        case .settings:
            // 收集設置數據
            collectSettings()

        case .shortcuts:
            // 收集快捷鍵數據
            collectShortcuts()

        case .templates:
            // 收集模板數據
            collectTemplates()
        }
    }

    /// 導入數據
    private func importData(type: DataType, data: Any) throws {
        switch type {
        case .scripts:
            // 導入腳本數據
            try importScripts(data)

        case .settings:
            // 導入設置數據
            importSettings(data)

        case .shortcuts:
            // 導入快捷鍵數據
            importShortcuts(data)

        case .templates:
            // 導入模板數據
            importTemplates(data)
        }
    }

    /// 收集腳本數據
    private func collectScripts() throws -> [[String: Any]] {
        let scriptsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            .appendingPathComponent("Scripts")

        var scripts: [[String: Any]] = []

        let fileManager = FileManager.default
        let files = try fileManager.contentsOfDirectory(at: scriptsDirectory, includingPropertiesForKeys: nil)

        for file in files where file.pathExtension == "json" {
            let data = try Data(contentsOf: file)
            if let script = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                scripts.append(script)
            }
        }

        return scripts
    }

    /// 收集設置數據
    private func collectSettings() -> [String: Any] {
        UserDefaults.standard.dictionaryRepresentation()
    }

    /// 收集快捷鍵數據
    private func collectShortcuts() -> [String: Any] {
        ShortcutManager.shared.getAllShortcuts().mapValues { shortcut in
            [
                "keyCode": shortcut.keyCode,
                "modifiers": shortcut.modifiers,
                "action": shortcut.action,
                "isEnabled": shortcut.isEnabled,
            ]
        }
    }

    /// 收集模板數據
    private func collectTemplates() -> [[String: Any]] {
        // 實現模板數據收集邏輯
        []
    }

    /// 導入腳本數據
    private func importScripts(_ data: Any) throws {
        guard let scripts = data as? [[String: Any]] else { return }

        let scriptsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            .appendingPathComponent("Scripts")

        try FileManager.default.createDirectory(at: scriptsDirectory, withIntermediateDirectories: true)

        for script in scripts {
            let data = try JSONSerialization.data(withJSONObject: script, options: .prettyPrinted)
            let file = scriptsDirectory.appendingPathComponent("\(UUID().uuidString).json")
            try data.write(to: file)
        }
    }

    /// 導入設置數據
    private func importSettings(_ data: Any) {
        guard let settings = data as? [String: Any] else { return }

        for (key, value) in settings {
            UserDefaults.standard.set(value, forKey: key)
        }
    }

    /// 導入快捷鍵數據
    private func importShortcuts(_ data: Any) {
        guard let shortcuts = data as? [String: [String: Any]] else { return }

        for (identifier, shortcutData) in shortcuts {
            guard let keyCode = shortcutData["keyCode"] as? Int,
                  let modifiers = shortcutData["modifiers"] as? Int,
                  let action = shortcutData["action"] as? String,
                  let isEnabled = shortcutData["isEnabled"] as? Bool
            else {
                continue
            }

            let shortcut = ShortcutManager.ShortcutConfig(
                keyCode: keyCode,
                modifiers: modifiers,
                action: action,
                isEnabled: isEnabled
            )

            _ = ShortcutManager.shared.registerShortcut(shortcut, identifier: identifier)
        }
    }

    /// 導入模板數據
    private func importTemplates(_: Any) {
        // 實現模板數據導入邏輯
    }

    /// 保存版本信息
    private func saveVersions() {
        let versionsDict = versions.mapValues { $0.timeIntervalSince1970 }
        UserDefaults.standard.set(versionsDict, forKey: "DataVersions")
    }

    /// 加載版本信息
    private func loadVersions() {
        if let versionsDict = UserDefaults.standard.dictionary(forKey: "DataVersions") as? [String: TimeInterval] {
            versions = versionsDict.mapValues { Date(timeIntervalSince1970: $0) }
        }
    }

    /// 保存備份列表
    private func saveBackups() {
        let encoder = JSONEncoder()
        if let data = try? encoder.encode(backups) {
            UserDefaults.standard.set(data, forKey: "DataBackups")
        }
    }

    /// 加載備份列表
    private func loadBackups() {
        let decoder = JSONDecoder()
        if let data = UserDefaults.standard.data(forKey: "DataBackups"),
           let loadedBackups = try? decoder.decode([BackupInfo].self, from: data)
        {
            backups = loadedBackups
        }
    }
}
