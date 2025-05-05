// LogService.swift
// 集中式日誌服務，用於記錄應用程式事件
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/QA_AUTOCHECK.md、docs/SECURITY_POLICY.md 获取结构与命名规范

import Foundation
import SwiftUI

/// 日誌條目結構
struct LogEntry: Identifiable, Codable {
    let id: UUID
    let timestamp: Date
    let source: String
    let message: String
    let level: LogLevel

    init(id: UUID = UUID(), timestamp: Date = Date(), source: String, message: String, level: LogLevel = .info) {
        self.id = id
        self.timestamp = timestamp
        self.source = source
        self.message = message
        self.level = level
    }
}

/// 日誌級別
enum LogLevel: String, Codable {
    case debug = "DEBUG"
    case info = "INFO"
    case warning = "WARN"
    case error = "ERROR"

    var color: Color {
        switch self {
        case .debug: .gray
        case .info: .blue
        case .warning: .orange
        case .error: .red
        }
    }
}

/// 日誌服務單例
class LogService: ObservableObject {
    // MARK: - 單例實例

    static let shared = LogService()

    // MARK: - 屬性

    @Published private(set) var logs: [LogEntry] = []
    private let maxLogCount = 1000 // 最大日誌條目數
    private let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss.SSS"
        return formatter
    }()

    // MARK: - 初始化

    private init() {
        // 私有初始化，確保單例模式
    }

    // MARK: - 日誌方法

    /// 記錄日誌
    /// - Parameters:
    ///   - message: 日誌訊息
    ///   - level: 日誌級別
    ///   - source: 來源（自動獲取調用者）
    @MainActor
    func log(_ message: String, level: LogLevel = .info, source: String = #function) {
        let entry = LogEntry(source: source, message: message, level: level)

        // 添加新日誌
        logs.append(entry)

        // 限制日誌數量
        if logs.count > maxLogCount {
            logs.removeFirst(logs.count - maxLogCount)
        }
    }

    /// 清空日誌
    @MainActor
    func clear() {
        logs.removeAll()
    }

    /// 匯出日誌
    /// - Returns: 日誌文件 URL
    @MainActor
    func exportLogs() throws -> URL {
        let fileManager = FileManager.default
        let appSupportURL = try fileManager.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )

        let logsDirectory = appSupportURL.appendingPathComponent("AutoClicker/logs")
        try fileManager.createDirectory(at: logsDirectory, withIntermediateDirectories: true)

        let dateString = dateFormatter.string(from: Date())
        let fileName = "logs_\(dateString).txt"
        let fileURL = logsDirectory.appendingPathComponent(fileName)

        // 格式化日誌內容
        let logContent = logs.map { entry in
            let timestamp = dateFormatter.string(from: entry.timestamp)
            return "[\(timestamp)] [\(entry.level.rawValue)] [\(entry.source)] \(entry.message)"
        }.joined(separator: "\n")

        // 寫入文件
        try logContent.write(to: fileURL, atomically: true, encoding: .utf8)

        return fileURL
    }

    // MARK: - 輔助方法

    /// 格式化日誌條目
    @MainActor
    func formatLogEntry(_ entry: LogEntry) -> String {
        let timestamp = dateFormatter.string(from: entry.timestamp)
        return "[\(timestamp)] [\(entry.level.rawValue)] [\(entry.source)] \(entry.message)"
    }

    /// 過濾日誌
    @MainActor
    func filterLogs(by level: LogLevel? = nil, source: String? = nil) -> [LogEntry] {
        logs.filter { entry in
            if let level, entry.level != level {
                return false
            }
            if let source, entry.source != source {
                return false
            }
            return true
        }
    }
}

// MARK: - 擴展方法

extension LogService {
    /// 快速記錄錯誤
    @MainActor
    func error(_ message: String, source: String = #function) {
        log(message, level: .error, source: source)
    }

    /// 快速記錄警告
    @MainActor
    func warning(_ message: String, source: String = #function) {
        log(message, level: .warning, source: source)
    }

    /// 快速記錄資訊
    @MainActor
    func info(_ message: String, source: String = #function) {
        log(message, level: .info, source: source)
    }

    /// 快速記錄調試資訊
    @MainActor
    func debug(_ message: String, source: String = #function) {
        log(message, level: .debug, source: source)
    }
}
