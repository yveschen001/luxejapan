// ScriptStorageService.swift
// 腳本儲存與讀取服務：使用 JSON 格式存於 App Support 路徑，符合 docs/DATA_SCHEMA.md 與 docs/SECURITY_POLICY.md
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/STYLE_GUIDE.md 获取结构与命名规范

import Foundation

enum ScriptStorageError: Error {
    case directoryCreationFailed(String)
    case fileWriteFailed(String)
    case fileReadFailed(String)
    case fileDeleteFailed(String)
    case jsonDecodeFailed(String)
    case jsonEncodeFailed(String)
}

class ScriptStorageService {
    static let shared = ScriptStorageService()
    private let fileManager = FileManager.default
    public let scriptsDirectory: URL
    private let fileExtension = "json"
    private let bom: [UInt8] = [0xEF, 0xBB, 0xBF] // UTF-8 BOM

    private init() {
        let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        scriptsDirectory = appSupport.appendingPathComponent("AutoClicker/scripts", isDirectory: true)
        do {
            try fileManager.createDirectory(at: scriptsDirectory, withIntermediateDirectories: true)
        } catch {
            print("[ERROR] 無法建立腳本資料夾：\(error.localizedDescription)")
        }
    }

    /// 儲存腳本為 JSON 檔案（UTF-8 with BOM）
    /// - Parameters:
    ///   - script: 要儲存的腳本
    ///   - name: 檔案名稱（不含副檔名）
    /// - Throws: ScriptStorageError
    @MainActor
    func save(script: Script, named name: String) throws {
        let fileURL = scriptsDirectory.appendingPathComponent("\(name).\(fileExtension)")
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted
            let jsonData = try encoder.encode(script)
            var dataWithBOM = Data(bom)
            dataWithBOM.append(jsonData)
            try dataWithBOM.write(to: fileURL, options: .atomic)
        } catch {
            print("[ERROR] 儲存腳本失敗：\(error.localizedDescription)")
            throw ScriptStorageError.fileWriteFailed(error.localizedDescription)
        }
    }

    /// 讀取所有腳本（自動過濾非 JSON 檔案）
    /// - Returns: [Script]
    /// - Throws: ScriptStorageError
    @MainActor
    func loadAllScripts() throws -> [Script] {
        do {
            let fileURLs = try fileManager.contentsOfDirectory(at: scriptsDirectory, includingPropertiesForKeys: nil)
            var scripts: [Script] = []
            for url in fileURLs where url.pathExtension == fileExtension {
                do {
                    var data = try Data(contentsOf: url)
                    // 移除 BOM（若存在）
                    if data.starts(with: bom) {
                        data = data.advanced(by: bom.count)
                    }
                    let script = try JSONDecoder().decode(Script.self, from: data)
                    scripts.append(script)
                } catch {
                    print("[ERROR] 讀取腳本失敗：\(url.lastPathComponent)：\(error.localizedDescription)")
                    // 跳過錯誤檔案，繼續讀取其他腳本
                }
            }
            return scripts
        } catch {
            print("[ERROR] 讀取腳本目錄失敗：\(error.localizedDescription)")
            throw ScriptStorageError.fileReadFailed(error.localizedDescription)
        }
    }

    /// 列出所有腳本（別名）
    /// - Returns: [Script]
    /// - Throws: ScriptStorageError
    @MainActor
    func listAll() throws -> [Script] {
        try loadAllScripts()
    }

    /// 刪除指定名稱的腳本
    /// - Parameter name: 檔案名稱（不含副檔名）
    /// - Throws: ScriptStorageError
    @MainActor
    func delete(scriptNamed name: String) throws {
        let fileURL = scriptsDirectory.appendingPathComponent("\(name).\(fileExtension)")
        do {
            try fileManager.removeItem(at: fileURL)
        } catch {
            print("[ERROR] 刪除腳本失敗：\(error.localizedDescription)")
            throw ScriptStorageError.fileDeleteFailed(error.localizedDescription)
        }
    }
}
