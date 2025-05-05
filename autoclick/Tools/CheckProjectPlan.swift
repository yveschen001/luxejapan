import Foundation

/// 項目計劃檢查器
class ProjectPlanChecker {
    static func check() throws {
        print("📋 開始檢查項目計劃...")
        
        // 檢查必要文件
        try checkRequiredFiles()
        
        // 檢查任務一致性
        try checkTaskConsistency()
        
        // 檢查規範文件
        try checkSpecificationFiles()
        
        print("✅ 項目計劃檢查完成")
    }
    
    private static func checkRequiredFiles() throws {
        let requiredFiles = [
            "docs/PROJECT_PLAN_TODO.md",
            "docs/NEXT_TASKS.md",
            "docs/SPEC.md",
            "docs/SHORTCUTS.md",
            "docs/UI_GUIDELINES.md",
            "docs/QA_AUTOCHECK.md",
            "docs/APPSTORE_NOTES.md",
            "docs/DATA_SCHEMA.md",
            "docs/SECURITY_POLICY.md",
            "docs/IMAGE_RECOGNITION_RULES.md",
            "docs/STYLE_GUIDE.md",
            "docs/CONTRIBUTING.md"
        ]
        
        for file in requiredFiles {
            guard FileManager.default.fileExists(atPath: file) else {
                throw ProjectPlanError.missingFile(file)
            }
        }
    }
    
    private static func checkTaskConsistency() throws {
        // 讀取項目計劃
        guard let projectPlan = try? String(contentsOfFile: "docs/PROJECT_PLAN_TODO.md", encoding: .utf8) else {
            throw ProjectPlanError.invalidFile("PROJECT_PLAN_TODO.md")
        }
        
        // 讀取任務列表
        guard let nextTasks = try? String(contentsOfFile: "docs/NEXT_TASKS.md", encoding: .utf8) else {
            throw ProjectPlanError.invalidFile("NEXT_TASKS.md")
        }
        
        // 提取任務標識符
        let projectPlanTasks = extractTasks(from: projectPlan)
        let nextTasksList = extractTasks(from: nextTasks)
        
        // 檢查任務一致性
        for task in projectPlanTasks {
            if !nextTasksList.contains(task) {
                throw ProjectPlanError.inconsistentTask(task)
            }
        }
    }
    
    private static func checkSpecificationFiles() throws {
        let specFiles = [
            "docs/SPEC.md",
            "docs/SHORTCUTS.md",
            "docs/UI_GUIDELINES.md",
            "docs/QA_AUTOCHECK.md",
            "docs/APPSTORE_NOTES.md",
            "docs/DATA_SCHEMA.md",
            "docs/SECURITY_POLICY.md",
            "docs/IMAGE_RECOGNITION_RULES.md",
            "docs/STYLE_GUIDE.md",
            "docs/CONTRIBUTING.md"
        ]
        
        for file in specFiles {
            guard let content = try? String(contentsOfFile: file, encoding: .utf8) else {
                throw ProjectPlanError.invalidFile(file)
            }
            
            // 檢查文件是否包含必要的標記
            if !content.contains("# 🚫 Immutable Contract Files") {
                throw ProjectPlanError.missingMarker(file, "# 🚫 Immutable Contract Files")
            }
        }
    }
    
    private static func extractTasks(from content: String) -> Set<String> {
        var tasks = Set<String>()
        let lines = content.components(separatedBy: .newlines)
        
        for line in lines {
            if line.hasPrefix("- [ ]") || line.hasPrefix("- [x]") {
                let task = line.trimmingCharacters(in: .whitespaces)
                tasks.insert(task)
            }
        }
        
        return tasks
    }
}

/// 項目計劃錯誤類型
enum ProjectPlanError: Error {
    case missingFile(String)
    case invalidFile(String)
    case inconsistentTask(String)
    case missingMarker(String, String)
    
    var description: String {
        switch this {
        case .missingFile(let file):
            return "缺少必要文件：\(file)"
        case .invalidFile(let file):
            return "文件格式無效：\(file)"
        case .inconsistentTask(let task):
            return "任務不一致：\(task)"
        case .missingMarker(let file, let marker):
            return "\(file) 缺少必要標記：\(marker)"
        }
    }
}

// MARK: - 主程序入口
@main
struct CheckProjectPlan {
    static func main() {
        do {
            try ProjectPlanChecker.check()
        } catch let error as ProjectPlanError {
            print("❌ 項目計劃檢查失敗：\(error.description)")
            exit(1)
        } catch {
            print("❌ 項目計劃檢查失敗：未知錯誤")
            exit(1)
        }
    }
} 