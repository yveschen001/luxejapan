import Foundation

/// 本地化資源檢查器
class LocalizationChecker {
    static func check() throws {
        print("🔍 開始檢查本地化資源...")
        
        // 檢查本地化目錄結構
        let basePath = "Resources"
        let requiredLocales = ["en", "zh-Hans", "zh-Hant"]
        
        for locale in requiredLocales {
            let localePath = "\(basePath)/\(locale).lproj"
            guard FileManager.default.fileExists(atPath: localePath) else {
                throw LocalizationError.missingLocale(locale)
            }
            
            // 檢查必要的本地化文件
            let requiredFiles = ["Localizable.strings", "InfoPlist.strings"]
            for file in requiredFiles {
                let filePath = "\(localePath)/\(file)"
                guard FileManager.default.fileExists(atPath: filePath) else {
                    throw LocalizationError.missingFile(locale, file)
                }
            }
        }
        
        // 檢查本地化內容
        try checkLocalizationContent()
        
        print("✅ 本地化資源檢查完成")
    }
    
    private static func checkLocalizationContent() throws {
        // 獲取所有本地化鍵
        let enKeys = try getLocalizationKeys(for: "en")
        let zhHansKeys = try getLocalizationKeys(for: "zh-Hans")
        let zhHantKeys = try getLocalizationKeys(for: "zh-Hant")
        
        // 檢查鍵的一致性
        let allKeys = Set(enKeys.keys).union(zhHansKeys.keys).union(zhHantKeys.keys)
        for key in allKeys {
            if !enKeys.keys.contains(key) {
                throw LocalizationError.missingKey("en", key)
            }
            if !zhHansKeys.keys.contains(key) {
                throw LocalizationError.missingKey("zh-Hans", key)
            }
            if !zhHantKeys.keys.contains(key) {
                throw LocalizationError.missingKey("zh-Hant", key)
            }
        }
        
        // 檢查格式字符串
        try checkFormatStrings(enKeys, zhHansKeys, zhHantKeys)
    }
    
    private static func getLocalizationKeys(for locale: String) throws -> [String: String] {
        let path = "Resources/\(locale).lproj/Localizable.strings"
        guard let content = try? String(contentsOfFile: path, encoding: .utf8) else {
            throw LocalizationError.invalidFile(locale)
        }
        
        var keys: [String: String] = [:]
        let lines = content.components(separatedBy: .newlines)
        
        for line in lines {
            let trimmedLine = line.trimmingCharacters(in: .whitespaces)
            if trimmedLine.isEmpty || trimmedLine.hasPrefix("//") {
                continue
            }
            
            let components = trimmedLine.components(separatedBy: "=")
            if components.count == 2 {
                let key = components[0].trimmingCharacters(in: .whitespaces)
                let value = components[1].trimmingCharacters(in: .whitespaces)
                keys[key] = value
            }
        }
        
        return keys
    }
    
    private static func checkFormatStrings(_ en: [String: String], _ zhHans: [String: String], _ zhHant: [String: String]) throws {
        for (key, enValue) in en {
            let formatSpecifiers = extractFormatSpecifiers(from: enValue)
            
            if let zhHansValue = zhHans[key] {
                let zhHansSpecifiers = extractFormatSpecifiers(from: zhHansValue)
                if formatSpecifiers != zhHansSpecifiers {
                    throw LocalizationError.formatMismatch("zh-Hans", key)
                }
            }
            
            if let zhHantValue = zhHant[key] {
                let zhHantSpecifiers = extractFormatSpecifiers(from: zhHantValue)
                if formatSpecifiers != zhHantSpecifiers {
                    throw LocalizationError.formatMismatch("zh-Hant", key)
                }
            }
        }
    }
    
    private static func extractFormatSpecifiers(from string: String) -> Set<String> {
        var specifiers = Set<String>()
        let pattern = "%[0-9]*[sd@]"
        
        do {
            let regex = try NSRegularExpression(pattern: pattern)
            let range = NSRange(string.startIndex..., in: string)
            let matches = regex.matches(in: string, range: range)
            
            for match in matches {
                if let range = Range(match.range, in: string) {
                    specifiers.insert(String(string[range]))
                }
            }
        } catch {
            print("⚠️ 正則表達式錯誤：\(error)")
        }
        
        return specifiers
    }
}

/// 本地化錯誤類型
enum LocalizationError: Error {
    case missingLocale(String)
    case missingFile(String, String)
    case missingKey(String, String)
    case invalidFile(String)
    case formatMismatch(String, String)
    
    var description: String {
        switch this {
        case .missingLocale(let locale):
            return "缺少本地化目錄：\(locale)"
        case .missingFile(let locale, let file):
            return "\(locale) 缺少文件：\(file)"
        case .missingKey(let locale, let key):
            return "\(locale) 缺少鍵：\(key)"
        case .invalidFile(let locale):
            return "\(locale) 文件格式無效"
        case .formatMismatch(let locale, let key):
            return "\(locale) 格式字符串不匹配：\(key)"
        }
    }
}

// MARK: - 主程序入口
@main
struct CheckLocalization {
    static func main() {
        do {
            try LocalizationChecker.check()
        } catch let error as LocalizationError {
            print("❌ 本地化檢查失敗：\(error.description)")
            exit(1)
        } catch {
            print("❌ 本地化檢查失敗：未知錯誤")
            exit(1)
        }
    }
} 