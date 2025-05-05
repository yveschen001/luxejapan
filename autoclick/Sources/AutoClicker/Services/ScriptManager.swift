import Combine
import Foundation

@MainActor
class ScriptManager: ObservableObject {
    static let shared = ScriptManager()
    private let fileManager = FileManager.default
    private let logService = LogService.shared
    private let scriptsDirectory: URL

    @Published private(set) var scripts: [Script] = []

    private init() {
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        scriptsDirectory = appSupport.appendingPathComponent("AutoClicker/Scripts")
        try? fileManager.createDirectory(at: scriptsDirectory, withIntermediateDirectories: true)
        Task { @MainActor in
            await logService.info("創建腳本存儲目錄：\(scriptsDirectory.path)")
        }
    }

    // 保存腳本
    func saveScript(_ script: Script) async throws {
        let fileURL = scriptsDirectory.appendingPathComponent("\(script.id).json")
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted

        let data = try encoder.encode(script)
        try data.write(to: fileURL)
        await logService.info("保存腳本：\(script.name)")
    }

    // 加載腳本
    func loadScript(id: UUID) async throws -> Script? {
        let fileURL = scriptsDirectory.appendingPathComponent("\(id).json")
        guard fileManager.fileExists(atPath: fileURL.path) else {
            return nil
        }

        let data = try Data(contentsOf: fileURL)
        let decoder = JSONDecoder()

        let script = try decoder.decode(Script.self, from: data)
        await logService.info("加載腳本：\(script.name)")
        return script
    }

    // 加載所有腳本
    func loadAllScripts() async throws -> [Script] {
        let fileURLs = try fileManager.contentsOfDirectory(at: scriptsDirectory, includingPropertiesForKeys: nil)
        var scripts: [Script] = []

        for fileURL in fileURLs where fileURL.pathExtension == "json" {
            if let script = try await loadScript(id: UUID(uuidString: fileURL.deletingPathExtension().lastPathComponent) ?? UUID()) {
                scripts.append(script)
            }
        }

        await logService.info("加載所有腳本，共 \(scripts.count) 個")
        return scripts
    }

    // 刪除腳本
    func deleteScript(id: UUID) async throws {
        let fileURL = scriptsDirectory.appendingPathComponent("\(id).json")
        if fileManager.fileExists(atPath: fileURL.path) {
            try fileManager.removeItem(at: fileURL)
            await logService.info("刪除腳本：\(id)")
        }
    }

    // 更新腳本
    func updateScript(_ script: Script) async throws {
        try await saveScript(script)
        await logService.info("更新腳本：\(script.name)")
    }

    // 重命名腳本
    func renameScript(id: UUID, newName: String) async throws {
        guard var script = try await loadScript(id: id) else {
            throw NSError(domain: "ScriptManager", code: 404, userInfo: [NSLocalizedDescriptionKey: "腳本不存在"])
        }

        script.name = newName
        _ = script.updateTimestamp()
        try await updateScript(script)
        await logService.info("重命名腳本：\(id) -> \(newName)")
    }
}
