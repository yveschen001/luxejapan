> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

# AutoClicker for macOS - 自动化测试规范

##  验收目标

### 1. 验收范围
- 功能完整性
- 界面一致性
- 用户操作容错性
- 系统权限状态
- 组件可维护性
- 自动修复能力
- 稳定性保证
- App Store 准备状态

### 2. 验收标准
- 符合 UI_GUIDELINES.md 规范
- 符合 SHORTCUTS.md 规范
- 符合 .cursorrules 开发规范
- 符合 UI_TESTS_PLAN.md 测试要求

## 🧩 功能验收

### 1. 脚本与录制
```swift
// 脚本存储验证
func validateScriptStorage() {
    let scriptPath = "~/Library/Application Support/AutoClicker/scripts/"
    XCTAssertTrue(FileManager.default.fileExists(atPath: scriptPath))
    
    let script = Script(name: "test", events: [])
    try? script.save()
    XCTAssertTrue(FileManager.default.fileExists(atPath: script.fileURL.path))
}

// 播放状态验证
func validatePlaybackState() {
    let app = XCUIApplication()
    app.launch()
    
    app.buttons["playButton"].tap()
    XCTAssertEqual(app.staticTexts["statusLabel"].label, "播放中")
}
```

### 2. 快捷键逻辑
```swift
// 快捷键绑定验证
func validateShortcutBinding() {
    let shortcut = Shortcut(key: "r", modifiers: [.command])
    XCTAssertTrue(shortcut.isValid)
    
    let systemShortcut = Shortcut(key: "q", modifiers: [.command])
    XCTAssertFalse(systemShortcut.isValid)
}

// 快捷键冲突验证
func validateShortcutConflict() {
    let shortcutManager = ShortcutManager()
    let result = shortcutManager.register(shortcut: Shortcut(key: "q", modifiers: [.command]))
    XCTAssertFalse(result.success)
    XCTAssertNotNil(result.error)
}
```

### 3. 图像识别
```swift
// 图像设置验证
func validateImageSettings() {
    let image = TemplateImage(name: "test")
    XCTAssertNotNil(image.interval)
    XCTAssertNotNil(image.clickMode)
}

// 多图像执行验证
func validateMultiImageExecution() {
    let executor = ImageExecutor()
    let images = [TemplateImage(), TemplateImage()]
    executor.execute(images: images)
    XCTAssertEqual(executor.status, .executing)
}
```

### 1. 模組管理測試
```swift
// 模組生成測試
func testModuleGeneration() {
    let manager = SmartModuleManager()
    let result = manager.generateModule(name: "TestModule")
    XCTAssertTrue(result.success)
    XCTAssertNotNil(result.module)
}

// 模組擴充測試
func testModuleExtension() {
    let manager = SmartModuleManager()
    let result = manager.extendModule(name: "TestModule", with: ["newFeature"])
    XCTAssertTrue(result.success)
    XCTAssertTrue(result.module.contains("newFeature"))
}

// 模組合併測試
func testModuleMerge() {
    let manager = SmartModuleManager()
    let result = manager.mergeModules(["ModuleA", "ModuleB"])
    XCTAssertTrue(result.success)
    XCTAssertNotNil(result.mergedModule)
}
```

## 🧠 逻辑与稳定性

### 1. 文件操作
```swift
// 目录检查与创建
func validateDirectoryCreation() {
    let path = "~/Library/Application Support/AutoClicker/scripts/"
    try? FileManager.default.createDirectory(atPath: path, withIntermediateDirectories: true)
    XCTAssertTrue(FileManager.default.fileExists(atPath: path))
}

// JSON 存储验证
func validateJSONStorage() {
    let data = try? JSONEncoder().encode(Script())
    XCTAssertNotNil(data)
    XCTAssertTrue(String(data: data!, encoding: .utf8)?.hasPrefix("\u{FEFF}") ?? false)
}
```

### 2. 错误处理
```swift
// 异常捕获验证
func validateErrorHandling() {
    do {
        try performRiskyOperation()
    } catch {
        XCTAssertNotNil(error)
        XCTAssertTrue(LogManager.shared.hasError(error))
    }
}

// 权限检查验证
func validatePermissionCheck() {
    let hasPermission = AXIsProcessTrusted()
    if !hasPermission {
        XCTAssertTrue(AlertManager.showPermissionAlert())
    }
}
```

## 🎨 UI 结构验收

### 1. 可访问性标识
```swift
// 组件标识验证
func validateAccessibilityIdentifiers() {
    let app = XCUIApplication()
    app.launch()
    
    let elements = app.buttons.allElementsBoundByIndex
    for element in elements {
        XCTAssertNotNil(element.identifier)
    }
}
```

### 2. 本地化验证
```swift
// 本地化键值验证
func validateLocalizationKeys() {
    let strings = NSLocalizedString("play_button", comment: "")
    XCTAssertNotEqual(strings, "play_button")
    
    let missingKey = NSLocalizedString("nonexistent_key", comment: "")
    XCTAssertEqual(missingKey, "nonexistent_key")
}
```

## ♿ 可访问性验收

### 1. 标签验证
```swift
// 可访问性标签验证
func validateAccessibilityLabels() {
    let app = XCUIApplication()
    app.launch()
    
    let elements = app.buttons.allElementsBoundByIndex
    for element in elements {
        XCTAssertNotNil(element.label)
        XCTAssertNotNil(element.hint)
    }
}
```

## 🌍 国际化验收

### 1. 语言切换
```swift
// 语言切换验证
func validateLanguageSwitch() {
    let app = XCUIApplication()
    app.launchArguments = ["-AppleLanguages", "(zh-Hans)"]
    app.launch()
    
    XCTAssertEqual(app.buttons["playButton"].label, "播放")
    
    app.terminate()
    app.launchArguments = ["-AppleLanguages", "(en)"]
    app.launch()
    
    XCTAssertEqual(app.buttons["playButton"].label, "Play")
}
```

## 🛠 自动修复规则

### 1. 快捷键冲突
```swift
// 快捷键冲突修复
func fixShortcutConflict() {
    let shortcut = Shortcut(key: "q", modifiers: [.command])
    if shortcut.isSystemShortcut {
        shortcut.modifiers.insert(.option)
        shortcut.save()
        AlertManager.showConflictResolution(shortcut)
    }
}
```

### 2. 文件系统
```swift
// 目录自动创建
func fixMissingDirectory() {
    let path = "~/Library/Application Support/AutoClicker/scripts/"
    if !FileManager.default.fileExists(atPath: path) {
        try? FileManager.default.createDirectory(atPath: path, withIntermediateDirectories: true)
    }
}
```

### 3. 可访问性
```swift
// 可访问性标识修复
func fixMissingAccessibility() {
    let elements = getAllUIElements()
    for element in elements {
        if element.identifier == nil {
            element.identifier = generateIdentifier(for: element)
        }
    }
}
```

## 📊 验收指标

### 1. 测试覆盖率
- UI 测试成功率 ≥ 95%
- 功能测试覆盖率 ≥ 90%
- 错误处理覆盖率 100%
- 可访问性覆盖率 100%

### 2. 性能指标
- 启动时间 < 2s
- 内存占用 < 200MB
- CPU 使用率 < 30%
- 响应时间 < 100ms

## 📝 验收文档

### 1. 验收报告
- 测试结果统计
- 问题追踪记录
- 修复建议列表
- 性能分析报告

### 2. 维护文档
- 验收规则更新记录
- 自动修复策略说明
- 问题复现步骤
- 解决方案记录

## 🔄 更新日志

### v1.0.0
- 初始验收规则
- 实现自动修复
- 添加验收指标
- 完成文档规范

### v1.1.0
- 优化验收流程
- 完善修复策略
- 提升测试覆盖率
- 改进性能指标

## 🔗 交叉引用声明

- 本文档需与以下文档保持一致性与联动：
  - `CONTRIBUTING.md`：贡献流程与自动验收规则联动
  - `STYLE_GUIDE.md`：风格规范需与验收标准一致
  - `DATA_SCHEMA.md`：数据结构需与验收规则联动
  - `SHORTCUTS.md`：快捷键相关验收需校验一致性
  - `.cursorrules`：AI 生成代码需符合本规范

- 变更本文件时，建议自动通知相关文档维护者/负责人。

## 🤖 自动化校验要求

- PR/CI 流程需自动校验：
  - 自动化测试、验收脚本与本规范一致
  - 主要文档变更需自动生成变更日志并通知团队
  - 变更自动触发相关测试与验收流程 

### 單例與 Actor 隔離自動驗收
- 檢查所有 Service/Manager/單例類別 static let shared 屬性與 class 宣告，不可加上 @MainActor 或任何 actor 隔離標註。
- 只允許將 @MainActor 標註於需要主執行緒的 method。
- 違反此規範將自動標記為驗收不通過，並提示修正。 

### 圖像識別自動化測試
1. 單元測試：ImageRecognitionService（ModernScreenCaptureService）支援模板比對、異常處理、權限檢查，所有截圖功能必須使用 ScreenCaptureKit，不得再出現 CGWindowListCreateImage 或 captureScreen 舊方法
2. UI 測試：截圖、模板選取、比對流程全自動 

### CI/CD 自動化驗收腳本
1. 必須檢查所有 Swift 檔案，不得出現 CGWindowListCreateImage 或 captureScreen 舊方法，違規則自動阻擋合併。 

### Notification.Name 擴展驗收
- 所有 Notification.Name 擴展必須集中於 `AutoClicker/Extensions/Notification+Name.swift`，禁止於其他檔案重複定義。
- CI/CD 應自動檢查是否有重複定義，違規則阻擋合併。 

# 自動化測試規範

## 測試範圍
1. 單元測試
   - 核心功能測試
   - 工具類測試
   - 模型測試
   - 服務測試

2. UI 測試
   - 界面交互測試
   - 視覺效果測試
   - 響應性測試
   - 適配性測試

3. 集成測試
   - 功能集成測試
   - 性能集成測試
   - 穩定性測試
   - 兼容性測試

## 測試要求
1. 覆蓋率要求
   - 單元測試 > 80%
   - UI 測試 > 70%
   - 集成測試 > 60%
   - 總覆蓋率 > 70%

2. 性能要求
   - 啟動時間 < 2s
   - 響應時間 < 100ms
   - 內存使用 < 200MB
   - CPU 使用 < 30%

3. 穩定性要求
   - 崩潰率 < 0.1%
   - 錯誤處理率 100%
   - 數據保存率 100%
   - 腳本執行率 100%

## 自動化流程
1. 測試執行
   - 自動觸發測試
   - 並行執行測試
   - 測試結果收集
   - 測試報告生成

2. 問題處理
   - 自動問題分類
   - 自動問題分配
   - 自動修復建議
   - 自動回歸測試

3. 報告生成
   - 測試結果報告
   - 性能分析報告
   - 問題統計報告
   - 改進建議報告

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - 測試覆蓋率檢查
  - 性能指標檢查
  - 穩定性檢查
  - 主要文檔變更需自動生成變更日誌並通知團隊 