import Foundation

/// 最終驗收檢查器
class FinalAcceptanceChecker {
    static func check() throws {
        print("✅ 開始執行最終驗收...")
        
        // 檢查最終檢查清單
        try checkFinalChecklist()
        
        // 檢查本地測試計劃
        try checkLocalTestPlan()
        
        // 檢查 UI 測試計劃
        try checkUITestPlan()
        
        // 檢查專案同步計劃
        try checkProjectSyncPlan()
        
        print("✅ 最終驗收完成")
    }
    
    private static func checkFinalChecklist() throws {
        guard let content = try? String(contentsOfFile: "docs/FINAL_CHECKLIST.md", encoding: .utf8) else {
            throw FinalAcceptanceError.invalidFile("FINAL_CHECKLIST.md")
        }
        
        // 檢查是否有未完成的項目
        if content.contains("- [ ]") {
            throw FinalAcceptanceError.unfinishedItems
        }
    }
    
    private static func checkLocalTestPlan() throws {
        guard let content = try? String(contentsOfFile: "docs/LocalTestPlan.md", encoding: .utf8) else {
            throw FinalAcceptanceError.invalidFile("LocalTestPlan.md")
        }
        
        // 檢查測試計劃完整性
        let requiredSections = [
            "測試環境",
            "測試範圍",
            "測試步驟",
            "預期結果",
            "實際結果"
        ]
        
        for section in requiredSections {
            if !content.contains(section) {
                throw FinalAcceptanceError.missingSection("LocalTestPlan.md", section)
            }
        }
    }
    
    private static func checkUITestPlan() throws {
        guard let content = try? String(contentsOfFile: "docs/UI_TESTS_PLAN.md", encoding: .utf8) else {
            throw FinalAcceptanceError.invalidFile("UI_TESTS_PLAN.md")
        }
        
        // 檢查 UI 測試計劃完整性
        let requiredSections = [
            "測試場景",
            "測試用例",
            "測試數據",
            "預期結果",
            "實際結果"
        ]
        
        for section in requiredSections {
            if !content.contains(section) {
                throw FinalAcceptanceError.missingSection("UI_TESTS_PLAN.md", section)
            }
        }
    }
    
    private static func checkProjectSyncPlan() throws {
        guard let content = try? String(contentsOfFile: "docs/PROJECT_SYNC_PLAN.md", encoding: .utf8) else {
            throw FinalAcceptanceError.invalidFile("PROJECT_SYNC_PLAN.md")
        }
        
        // 檢查同步計劃完整性
        let requiredSections = [
            "同步目標",
            "同步範圍",
            "同步步驟",
            "同步檢查",
            "同步驗證"
        ]
        
        for section in requiredSections {
            if !content.contains(section) {
                throw FinalAcceptanceError.missingSection("PROJECT_SYNC_PLAN.md", section)
            }
        }
    }
}

/// 最終驗收錯誤類型
enum FinalAcceptanceError: Error {
    case invalidFile(String)
    case unfinishedItems
    case missingSection(String, String)
    
    var description: String {
        switch this {
        case .invalidFile(let file):
            return "文件格式無效：\(file)"
        case .unfinishedItems:
            return "最終檢查清單中存在未完成的項目"
        case .missingSection(let file, let section):
            return "\(file) 缺少必要章節：\(section)"
        }
    }
}

// MARK: - 主程序入口
@main
struct FinalAcceptance {
    static func main() {
        do {
            try FinalAcceptanceChecker.check()
        } catch let error as FinalAcceptanceError {
            print("❌ 最終驗收失敗：\(error.description)")
            exit(1)
        } catch {
            print("❌ 最終驗收失敗：未知錯誤")
            exit(1)
        }
    }
} 