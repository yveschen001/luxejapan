# AutoClicker for macOS - 代码风格指南

> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

# AutoClicker for macOS - 代码风格与结构规范

## 🎯 规范目标

### 1. 代码质量
- 统一代码风格
- 提升可读性
- 增强可维护性
- 支持 AI 开发

### 2. 项目结构
- 清晰模块划分
- 合理文件组织
- 规范命名规则
- 完整文档支持

## 📁 项目结构

### 1. 目录规范
```
AutoClicker/
├── App/
│   ├── AppDelegate.swift
│   └── MainApp.swift
├── Views/
│   ├── MainView.swift
│   ├── RecorderView.swift
│   ├── ImageMatchView.swift
│   └── SettingsView.swift
├── ViewModels/
│   ├── MainViewModel.swift
│   ├── RecorderViewModel.swift
│   └── ImageMatchViewModel.swift
├── Services/
│   ├── ScriptStorageService.swift
│   ├── ImageRecognitionService.swift
│   └── AccessibilityEventService.swift
├── Models/
│   ├── ScriptAction.swift
│   └── RecognitionResult.swift
├── Resources/
│   ├── Localizable.strings
│   └── Assets.xcassets
└── Tests/
    ├── ViewTests/
    ├── ViewModelTests/
    └── ServiceTests/
```

### 2. 文件组织
```swift
// 文件头部注释
// AutoClicker
// Copyright © 2024 Your Name. All rights reserved.
// Created by AI Assistant on 2024-05-02.

import SwiftUI

// MARK: - Main View
struct MainView: View {
    // 实现代码
}

// MARK: - Preview
struct MainView_Previews: PreviewProvider {
    static var previews: some View {
        MainView()
    }
}
```

## 📝 命名规范

### 1. 类型命名
| 类型 | 规范 | 示例 |
|------|------|------|
| View | PascalCase + View | MainView |
| ViewModel | PascalCase + ViewModel | MainViewModel |
| Service | PascalCase + Service | ScriptStorageService |
| Model | 名词单数 | ScriptAction |
| Enum | PascalCase | ActionType |
| Protocol | PascalCase + able/ing | Observable |

### 2. 变量命名
```swift
// 常量
let kMaxRetries = 3
let kDefaultInterval = 500

// 变量
var currentScript: ScriptAction
var matchThreshold: Float

// 函数
func handleRecognitionResult(_ result: RecognitionResult)
func validateScript(_ script: ScriptAction) throws
```

## ✅ 代码风格

### 1. 类型定义
```swift
// 优先使用 struct
struct ScriptAction: Codable {
    let type: ActionType
    let position: CGPoint
    let delay: Int
}

// 需要引用语义时使用 class
class MainViewModel: ObservableObject {
    @Published var isRecording = false
    @Published var currentScript: ScriptAction?
}
```

### 2. 可选值处理
```swift
// 使用 guard let
func processScript(_ script: ScriptAction?) {
    guard let script = script else {
        LogManager.shared.error("Script is nil")
        return
    }
    // 处理脚本
}

// 使用 if let
if let result = recognitionResult {
    handleRecognitionResult(result)
}
```

### 3. 错误处理
```swift
func saveScript(_ script: ScriptAction) throws {
    do {
        try ScriptStorageService.shared.save(script)
    } catch {
        LogManager.shared.error("Failed to save script: \(error)")
        throw error
    }
}
```

## 📌 注释规范

### 1. 文档注释
```swift
/// 处理图像识别结果
/// - Parameter result: 识别结果
/// - Throws: 当处理失败时抛出错误
func handleRecognitionResult(_ result: RecognitionResult) throws {
    // 实现代码
}
```

### 2. 代码注释
```swift
// MARK: - Properties
private let scriptStorage: ScriptStorageService

// TODO: 实现图像识别优化
// FIXME: 修复内存泄漏问题
```

## 🧪 测试规范

### 1. 单元测试
```swift
class ScriptStorageServiceTests: XCTestCase {
    func testSaveScript() throws {
        let script = ScriptAction(type: .click, position: .zero, delay: 100)
        try ScriptStorageService.shared.save(script)
        let loaded = try ScriptStorageService.shared.load(script.id)
        XCTAssertEqual(script, loaded)
    }
}
```

### 2. UI 测试
```swift
class MainViewUITests: XCTestCase {
    func testStartRecording() {
        let app = XCUIApplication()
        app.launch()
        
        let startButton = app.buttons["start-recording-button"]
        XCTAssertTrue(startButton.exists)
        startButton.tap()
        
        XCTAssertTrue(app.staticTexts["recording"].exists)
    }
}
```

## 🔄 更新日志

### v1.0.0
- 初始代码规范
- 定义项目结构
- 制定命名规则
- 完善注释规范

### v1.1.0
- 优化测试规范
- 增加错误处理
- 完善文档注释
- 提升代码质量 

## 🔗 交叉引用声明

- 本文档需与以下文档保持一致性与联动：
  - `CONTRIBUTING.md`：开发流程、命名、结构需同步校验
  - `QA_AUTOCHECK.md`：自动验收规则需与风格规范联动
  - `.cursorrules`：AI 生成代码需符合本规范

- 变更本文件时，建议自动通知相关文档维护者/负责人。

## 🤖 自动化校验要求

- PR/CI 流程需自动校验：
  - 代码风格（SwiftLint）与本规范一致
  - 命名、缩进、注释、结构等与本规范一致
  - 主要文档变更需自动生成变更日志并通知团队 

## 模組管理規範
- 模組生成應遵循 MVVM 架構
- 模組擴充應保持向後兼容性
- 模組合併應避免命名衝突
- 模組應包含完整的單元測試
- 模組應有清晰的文檔說明 

## 單例與 Actor 隔離規範
- 所有 Service/Manager/單例類別（如 ScriptStorageService、LogService、AccessibilityEventService）之 static let shared 屬性與 class 宣告，禁止加上 @MainActor 或任何 actor 隔離標註。
- 只允許將 @MainActor 標註於需要主執行緒的 method。
- 若需主執行緒，請於 method 層級加 @MainActor，不可加在 class 或 static let shared 上。
- 違反此規範將導致 Swift 6 編譯錯誤，並影響自動化驗收。 

## 截圖功能風格規範
所有截圖功能必須統一調用 ModernScreenCaptureService（ScreenCaptureKit），不得再出現 CGWindowListCreateImage 或 captureScreen 舊方法。 

## 命名規範
1. 文件命名
   - 使用 PascalCase
   - 使用有意義的名稱
   - 避免縮寫
   - 保持一致性

2. 類型命名
   - 使用 PascalCase
   - 使用名詞
   - 避免縮寫
   - 保持一致性

3. 變量命名
   - 使用 camelCase
   - 使用有意義的名稱
   - 避免縮寫
   - 保持一致性

## 代碼格式
1. 縮進
   - 使用 4 個空格
   - 不使用 Tab
   - 保持一致性
   - 使用自動格式化

2. 空格
   - 操作符兩側
   - 逗號後
   - 冒號後
   - 大括號前

3. 換行
   - 每行不超過 100 字符
   - 適當的換行
   - 保持可讀性
   - 使用自動換行

## 註釋規範
1. 文檔註釋
   - 使用 /// 格式
   - 描述功能
   - 描述參數
   - 描述返回值

2. 代碼註釋
   - 使用 // 格式
   - 解釋複雜邏輯
   - 標記 TODO
   - 標記 FIXME

3. 註釋風格
   - 使用中文
   - 簡潔明了
   - 避免廢話
   - 保持更新

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - 代碼風格檢查
  - 命名規範檢查
  - 註釋完整性檢查
  - 格式一致性檢查
  - 主要文檔變更需自動生成變更日誌並通知團隊 