import Foundation

/// CI 檢查與驗收管理器
@main
struct RunCI {
    static func main() async {
        do {
            try await runCIChecks()
        } catch {
            print("CI 檢查失敗：\(error)")
            exit(1)
        }
    }
    
    private static func runCIChecks() async throws {
        // 檢查文檔一致性
        try await checkDocumentation()
        
        // 檢查數據結構
        try await checkDataSchema()
        
        // 檢查快捷鍵
        try await checkShortcuts()
        
        // 檢查構建錯誤
        try await fixBuildErrors()
        
        // 檢查目標成員
        try await checkTargetMembership()
        
        // 檢查任務進度
        try await checkTaskProgress()
        
        // 運行自動化測試
        try await runAutomatedTests()
        
        // 檢查本地化
        try await checkLocalization()
        
        // 檢查項目計劃
        try await checkProjectPlan()
        
        // 執行最終驗收
        try await performFinalAcceptance()
    }
    
    private static func checkDocumentation() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/python3")
        process.arguments = ["scripts/check_docs.py"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.documentationCheckFailed
        }
    }
    
    private static func checkDataSchema() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/python3")
        process.arguments = ["scripts/check_data_schema.py"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.dataSchemaCheckFailed
        }
    }
    
    private static func checkShortcuts() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/python3")
        process.arguments = ["scripts/check_shortcuts.py"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.shortcutsCheckFailed
        }
    }
    
    private static func fixBuildErrors() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/swift")
        process.arguments = ["build"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.buildFailed
        }
    }
    
    private static func checkTargetMembership() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/swift")
        process.arguments = ["package", "resolve"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.targetMembershipCheckFailed
        }
    }
    
    private static func checkTaskProgress() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/python3")
        process.arguments = ["scripts/check_tasks.py"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.taskProgressCheckFailed
        }
    }
    
    private static func runAutomatedTests() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/swift")
        process.arguments = ["test"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.testsFailed
        }
    }
    
    private static func checkLocalization() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/python3")
        process.arguments = ["scripts/check_localization.py"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.localizationCheckFailed
        }
    }
    
    private static func checkProjectPlan() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/python3")
        process.arguments = ["scripts/check_project_plan.py"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.projectPlanCheckFailed
        }
    }
    
    private static func performFinalAcceptance() async throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/python3")
        process.arguments = ["scripts/check_final_acceptance.py"]
        
        try process.run()
        process.waitUntilExit()
        
        guard process.terminationStatus == 0 else {
            throw CIError.finalAcceptanceFailed
        }
    }
}

enum CIError: Error {
    case documentationCheckFailed
    case dataSchemaCheckFailed
    case shortcutsCheckFailed
    case buildFailed
    case targetMembershipCheckFailed
    case taskProgressCheckFailed
    case testsFailed
    case localizationCheckFailed
    case projectPlanCheckFailed
    case finalAcceptanceFailed
    
    var description: String {
        switch self {
        case .documentationCheckFailed:
            return "文檔檢查失敗"
        case .dataSchemaCheckFailed:
            return "數據結構檢查失敗"
        case .shortcutsCheckFailed:
            return "快捷鍵檢查失敗"
        case .buildFailed:
            return "構建失敗"
        case .targetMembershipCheckFailed:
            return "目標成員檢查失敗"
        case .taskProgressCheckFailed:
            return "任務進度檢查失敗"
        case .testsFailed:
            return "測試失敗"
        case .localizationCheckFailed:
            return "本地化檢查失敗"
        case .projectPlanCheckFailed:
            return "項目計劃檢查失敗"
        case .finalAcceptanceFailed:
            return "最終驗收失敗"
        }
    }
} 