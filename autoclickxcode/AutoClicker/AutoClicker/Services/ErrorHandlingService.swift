import AppKit
import Foundation

/// 錯誤處理服務
class ErrorHandlingService {
    /// 單例
    static let shared = ErrorHandlingService()

    /// 錯誤類型
    enum ErrorType: String {
        case permission = "權限錯誤"
        case recording = "錄製錯誤"
        case playback = "播放錯誤"
        case script = "腳本錯誤"
        case image = "圖像錯誤"
        case system = "系統錯誤"
    }

    /// 錯誤詳情
    struct ErrorDetail {
        /// 錯誤類型
        let type: ErrorType
        /// 錯誤描述
        let description: String
        /// 錯誤代碼
        let code: Int
        /// 發生時間
        let timestamp: Date
        /// 錯誤堆棧
        let stackTrace: String?
        /// 相關數據
        let metadata: [String: Any]?
    }

    /// 修復建議
    struct RepairSuggestion {
        /// 建議標題
        let title: String
        /// 建議描述
        let description: String
        /// 修復步驟
        let steps: [String]
        /// 自動修復操作
        let autoRepair: (() -> Bool)?
    }

    /// 錯誤統計
    private var errorStats: [ErrorType: Int] = [:]

    /// 錯誤歷史
    private var errorHistory: [ErrorDetail] = []

    /// 最大歷史記錄數
    private let maxHistorySize = 100

    /// 初始化
    private init() {
        loadErrorStats()
    }

    /// 處理錯誤
    /// - Parameters:
    ///   - error: 錯誤對象
    ///   - type: 錯誤類型
    ///   - metadata: 相關數據
    /// - Returns: 修復建議
    func handleError(_ error: Error, type: ErrorType, metadata: [String: Any]? = nil) -> RepairSuggestion {
        // 創建錯誤詳情
        let detail = ErrorDetail(
            type: type,
            description: error.localizedDescription,
            code: (error as NSError).code,
            timestamp: Date(),
            stackTrace: Thread.callStackSymbols.joined(separator: "\n"),
            metadata: metadata
        )

        // 記錄錯誤
        recordError(detail)

        // 分析錯誤
        return analyzeError(detail)
    }

    /// 記錄錯誤
    /// - Parameter detail: 錯誤詳情
    private func recordError(_ detail: ErrorDetail) {
        // 更新統計
        errorStats[detail.type, default: 0] += 1

        // 添加到歷史記錄
        errorHistory.append(detail)

        // 限制歷史記錄大小
        if errorHistory.count > maxHistorySize {
            errorHistory.removeFirst()
        }

        // 保存統計數據
        saveErrorStats()

        // 記錄到日誌
        logError(detail)
    }

    /// 分析錯誤
    /// - Parameter detail: 錯誤詳情
    /// - Returns: 修復建議
    private func analyzeError(_ detail: ErrorDetail) -> RepairSuggestion {
        switch detail.type {
        case .permission:
            handlePermissionError(detail)
        case .recording:
            handleRecordingError(detail)
        case .playback:
            handlePlaybackError(detail)
        case .script:
            handleScriptError(detail)
        case .image:
            handleImageError(detail)
        case .system:
            handleSystemError(detail)
        }
    }

    /// 處理權限錯誤
    /// - Parameter detail: 錯誤詳情
    /// - Returns: 修復建議
    private func handlePermissionError(_ detail: ErrorDetail) -> RepairSuggestion {
        let code = (detail.code)

        switch code {
        case -1: // 輔助功能權限
            return RepairSuggestion(
                title: "需要輔助功能權限",
                description: "AutoClicker 需要輔助功能權限才能模擬鼠標操作",
                steps: [
                    "1. 打開系統偏好設置",
                    "2. 點擊安全性與隱私",
                    "3. 選擇隱私標籤",
                    "4. 點擊輔助功能",
                    "5. 勾選 AutoClicker",
                ],
                autoRepair: {
                    NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!)
                    return true
                }
            )

        case -2: // 屏幕錄製權限
            return RepairSuggestion(
                title: "需要屏幕錄製權限",
                description: "AutoClicker 需要屏幕錄製權限才能進行圖像識別",
                steps: [
                    "1. 打開系統偏好設置",
                    "2. 點擊安全性與隱私",
                    "3. 選擇隱私標籤",
                    "4. 點擊屏幕錄製",
                    "5. 勾選 AutoClicker",
                ],
                autoRepair: {
                    NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture")!)
                    return true
                }
            )

        default:
            return RepairSuggestion(
                title: "權限錯誤",
                description: "請確保已授予所有必要權限",
                steps: [
                    "檢查應用權限設置",
                    "重新啟動應用",
                    "如果問題仍然存在，請重新安裝應用",
                ],
                autoRepair: nil
            )
        }
    }

    /// 處理錄製錯誤
    /// - Parameter detail: 錯誤詳情
    /// - Returns: 修復建議
    private func handleRecordingError(_: ErrorDetail) -> RepairSuggestion {
        RepairSuggestion(
            title: "錄製失敗",
            description: "無法錄製鼠標操作",
            steps: [
                "確保已授予必要權限",
                "檢查系統資源使用情況",
                "嘗試重新啟動應用",
            ],
            autoRepair: nil
        )
    }

    /// 處理播放錯誤
    /// - Parameter detail: 錯誤詳情
    /// - Returns: 修復建議
    private func handlePlaybackError(_: ErrorDetail) -> RepairSuggestion {
        RepairSuggestion(
            title: "播放失敗",
            description: "無法執行腳本操作",
            steps: [
                "檢查腳本格式是否正確",
                "確保目標窗口可見",
                "驗證坐標位置是否有效",
            ],
            autoRepair: nil
        )
    }

    /// 處理腳本錯誤
    /// - Parameter detail: 錯誤詳情
    /// - Returns: 修復建議
    private func handleScriptError(_ detail: ErrorDetail) -> RepairSuggestion {
        if let metadata = detail.metadata,
           let scriptContent = metadata["script"] as? String
        {
            // 分析腳本內容
            if scriptContent.contains("invalid") {
                return RepairSuggestion(
                    title: "腳本格式錯誤",
                    description: "腳本包含無效的命令或格式",
                    steps: [
                        "檢查腳本語法",
                        "修正無效的命令",
                        "使用示例腳本作為參考",
                    ],
                    autoRepair: nil
                )
            }
        }

        return RepairSuggestion(
            title: "腳本執行錯誤",
            description: "無法執行腳本操作",
            steps: [
                "檢查腳本內容",
                "確保所有命令有效",
                "驗證參數格式",
            ],
            autoRepair: nil
        )
    }

    /// 處理圖像錯誤
    /// - Parameter detail: 錯誤詳情
    /// - Returns: 修復建議
    private func handleImageError(_ detail: ErrorDetail) -> RepairSuggestion {
        if let metadata = detail.metadata,
           let errorCode = metadata["imageErrorCode"] as? Int
        {
            switch errorCode {
            case 1: // 圖像加載失敗
                return RepairSuggestion(
                    title: "圖像加載失敗",
                    description: "無法加載目標圖像",
                    steps: [
                        "確保圖像文件存在",
                        "檢查圖像格式是否支持",
                        "嘗試重新選擇圖像",
                    ],
                    autoRepair: nil
                )

            case 2: // 圖像識別失敗
                return RepairSuggestion(
                    title: "圖像識別失敗",
                    description: "無法在屏幕上找到目標圖像",
                    steps: [
                        "確保目標窗口可見",
                        "調整識別閾值",
                        "更新目標圖像",
                    ],
                    autoRepair: nil
                )

            default:
                return RepairSuggestion(
                    title: "圖像處理錯誤",
                    description: "圖像處理過程中發生錯誤",
                    steps: [
                        "檢查圖像設置",
                        "確保系統資源充足",
                        "重試操作",
                    ],
                    autoRepair: nil
                )
            }
        }

        return RepairSuggestion(
            title: "圖像錯誤",
            description: "圖像相關操作失敗",
            steps: [
                "檢查圖像設置",
                "確保圖像格式正確",
                "重試操作",
            ],
            autoRepair: nil
        )
    }

    /// 處理系統錯誤
    /// - Parameter detail: 錯誤詳情
    /// - Returns: 修復建議
    private func handleSystemError(_: ErrorDetail) -> RepairSuggestion {
        RepairSuggestion(
            title: "系統錯誤",
            description: "系統級別錯誤",
            steps: [
                "檢查系統資源使用情況",
                "重新啟動應用",
                "如果問題持續，請重新安裝",
            ],
            autoRepair: nil
        )
    }

    /// 獲取錯誤統計
    /// - Returns: 錯誤統計字典
    func getErrorStats() -> [ErrorType: Int] {
        errorStats
    }

    /// 獲取錯誤歷史
    /// - Returns: 錯誤歷史數組
    func getErrorHistory() -> [ErrorDetail] {
        errorHistory
    }

    /// 清除錯誤歷史
    func clearErrorHistory() {
        errorHistory.removeAll()
        errorStats.removeAll()
        saveErrorStats()
    }

    /// 保存錯誤統計
    private func saveErrorStats() {
        let statsDict = errorStats.mapKeys { $0.rawValue }
        UserDefaults.standard.set(statsDict, forKey: "ErrorStats")
    }

    /// 加載錯誤統計
    private func loadErrorStats() {
        if let statsDict = UserDefaults.standard.dictionary(forKey: "ErrorStats") as? [String: Int] {
            errorStats = statsDict.compactMapKeys { ErrorType(rawValue: $0) }
        }
    }

    /// 記錄錯誤到日誌
    /// - Parameter detail: 錯誤詳情
    private func logError(_ detail: ErrorDetail) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"

        let logEntry = """

        === 錯誤記錄 ===
        時間：\(dateFormatter.string(from: detail.timestamp))
        類型：\(detail.type.rawValue)
        描述：\(detail.description)
        代碼：\(detail.code)
        堆棧：\(detail.stackTrace ?? "無")
        元數據：\(detail.metadata?.description ?? "無")
        ===============

        """

        // 獲取日誌文件路徑
        let fileManager = FileManager.default
        let logDirectory = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
            .appendingPathComponent("AutoClicker/Logs")

        do {
            try fileManager.createDirectory(at: logDirectory, withIntermediateDirectories: true)

            let logFile = logDirectory.appendingPathComponent("error.log")

            if !fileManager.fileExists(atPath: logFile.path) {
                try "=== AutoClicker 錯誤日誌 ===\n".write(to: logFile, atomically: true, encoding: .utf8)
            }

            let handle = try FileHandle(forWritingTo: logFile)
            handle.seekToEndOfFile()
            handle.write(logEntry.data(using: .utf8)!)
            handle.closeFile()
        } catch {
            print("無法寫入錯誤日誌：\(error)")
        }
    }
}

// MARK: - Dictionary 擴展

extension Dictionary {
    func mapKeys<T>(_ transform: (Key) -> T) -> [T: Value] {
        [T: Value](uniqueKeysWithValues: map { (transform($0.key), $0.value) })
    }

    func compactMapKeys<T>(_ transform: (Key) -> T?) -> [T: Value] {
        [T: Value](uniqueKeysWithValues: compactMap { key, value in
            guard let newKey = transform(key) else { return nil }
            return (newKey, value)
        })
    }
}
