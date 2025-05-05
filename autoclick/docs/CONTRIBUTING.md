> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

# AutoClicker for macOS - 开发者贡献指南

## 🎯 贡献目标

### 1. 代码质量
- 遵循项目规范
- 确保代码可维护
- 支持 AI 开发
- 保持一致性

### 2. 协作流程
- 规范提交流程
- 完善测试覆盖
- 确保文档更新
- 支持多语言

## 📁 开发规范

### 1. 文档要求
- 阅读并遵守 STYLE_GUIDE.md
- 遵循 DATA_SCHEMA.md 规范
- 执行 QA_AUTOCHECK.md 检查
- 遵守 .cursorrules 规则

### 2. 代码要求
```swift
// 视图命名规范
struct MainView: View {
    // 实现代码
}

// 视图模型命名规范
class MainViewModel: ObservableObject {
    // 实现代码
}

// 服务命名规范
class ScriptStorageService {
    // 实现代码
}
```

## 🔁 提交流程

### 1. 分支管理
```bash
# 创建功能分支
git checkout -b feature/image-preview

# 创建修复分支
git checkout -b fix/shortcut-collision
```

### 2. 提交规范
```bash
# 功能提交
git commit -m "feat(recorder): add ability to edit delay per action"

# 修复提交
git commit -m "fix(view): correct dark mode layout for ImageListItem"

# 测试提交
git commit -m "test(service): add test for CGEvent injection fail-safe"
```

## 🧪 测试要求

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

## 🛠 开发工具

### 1. 推荐工具
- Cursor IDE
- Xcode 15+
- SwiftLint
- VS Code + SourceKit-LSP

### 2. 工具配置
```swift
// SwiftLint 配置
struct SwiftLintConfig {
    static let rules = [
        "identifier_name": ["min_length": ["warning": 3, "error": 2]],
        "type_name": ["min_length": ["warning": 3, "error": 2]],
        "line_length": ["warning": 120, "error": 200]
    ]
}
```

## 📦 提交规范

### 1. 代码规范
| 要求 | 说明 |
|------|------|
| 模块结构 | View/ViewModel/Service 分离 |
| 命名规范 | 使用 Swift 标准命名 |
| 缩进规范 | 使用 4 空格缩进 |
| 测试覆盖 | 包含单元测试和 UI 测试 |

### 2. 文档规范
| 要求 | 说明 |
|------|------|
| 注释完整 | 包含文档注释和代码注释 |
| 更新日志 | 记录版本变更 |
| 多语言支持 | 使用 LocalizedStringKey |
| 快捷键支持 | 遵循 SHORTCUTS.md |

## 🔍 安全检查

### 1. 权限检查
```swift
func checkPermissions() throws {
    // 检查辅助功能权限
    guard checkAccessibilityPermission() else {
        throw PermissionError.accessibilityNotGranted
    }
    
    // 检查屏幕录制权限
    guard checkScreenRecordingPermission() else {
        throw PermissionError.screenRecordingNotGranted
    }
}
```

### 2. 代码检查
```swift
func validateCode() throws {
    // 检查网络调用
    guard !containsNetworkCalls() else {
        throw SecurityError.networkCallDetected
    }
    
    // 检查文件访问
    guard !containsUnauthorizedFileAccess() else {
        throw SecurityError.unauthorizedFileAccess
    }
}
```

## 🔄 更新日志

### v1.0.0
- 初始贡献指南
- 定义提交流程
- 制定测试规范
- 完善文档要求

### v1.1.0
- 优化安全检查
- 增加工具配置
- 完善提交规范
- 提升协作效率

## 🔗 交叉引用声明

- 本文档需与以下文档保持一致性与联动：
  - `STYLE_GUIDE.md`：命名、结构、风格变更需同步校验
  - `DATA_SCHEMA.md`：数据结构变更需同步更新测试与文档
  - `QA_AUTOCHECK.md`：自动验收规则需与贡献流程联动
  - `SHORTCUTS.md`：快捷键相关开发需校验一致性
  - `.cursorrules`：AI 生成代码需符合本规范

- 变更本文件时，建议自动通知相关文档维护者/负责人。

## 🤖 自动化校验要求

- PR/CI 流程需自动校验：
  - 代码风格（SwiftLint）与 `STYLE_GUIDE.md` 一致
  - 数据格式与 `DATA_SCHEMA.md` 校验通过
  - 所有新增/变更功能均有对应测试，且通过 `QA_AUTOCHECK.md` 验收
  - 快捷键定义与 `SHORTCUTS.md` 一致
  - 主要文档变更需自动生成变更日志并通知团队

- 請參考 PROMPT_CHEATSHEET.md，統一使用標準提示語進行開發、測試、驗收、上架等協作。

- 所有開發任務請參考 docs/PROJECT_PLAN_TODO.md 作為唯一任務來源。

## 截圖功能貢獻規範
所有截圖相關貢獻必須使用 ModernScreenCaptureService（ScreenCaptureKit），不得再提交 CGWindowListCreateImage 或 captureScreen 舊方法。

# 貢獻指南

## 開發流程
1. 分支管理
   - 主分支：main
   - 開發分支：develop
   - 功能分支：feature/*
   - 修復分支：fix/*

2. 提交規範
   - 提交信息格式
   - 提交頻率
   - 提交大小
   - 提交審查

3. 代碼審查
   - 審查流程
   - 審查標準
   - 審查工具
   - 審查反饋

## 代碼規範
1. 命名規範
   - 文件命名
   - 類型命名
   - 變量命名
   - 函數命名

2. 代碼格式
   - 縮進
   - 空格
   - 換行
   - 註釋

3. 文檔規範
   - 代碼註釋
   - API 文檔
   - 更新日誌
   - 貢獻文檔

## 測試要求
1. 單元測試
   - 測試覆蓋率
   - 測試用例
   - 測試數據
   - 測試報告

2. 集成測試
   - 測試場景
   - 測試數據
   - 測試報告
   - 問題追蹤

3. 性能測試
   - 性能指標
   - 測試工具
   - 測試報告
   - 優化建議

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - 代碼規範檢查
  - 測試覆蓋率檢查
  - 文檔完整性檢查
  - 提交規範檢查
  - 主要文檔變更需自動生成變更日誌並通知團隊 