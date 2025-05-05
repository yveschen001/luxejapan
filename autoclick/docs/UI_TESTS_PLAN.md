# AutoClicker for macOS - UI 测试计划

> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

## 🎯 测试目标

### 1. 测试范围
- 用户操作流程
- 快捷键行为
- 图形交互
- 状态显示
- 可视化日志
- 可访问性支持
- 多语言切换
- 权限状态反馈

### 2. 测试框架
- **主要框架**：XCTest / XCUITest
- **识别方式**：`.accessibilityIdentifier`
- **快捷键测试**：符合 SHORTCUTS.md
- **UI 规范**：符合 UI_GUIDELINES.md
- **开发规范**：符合 .cursorrules

## 📋 测试场景

### 1. 主界面功能
```swift
// 主界面加载测试
func testMainInterfaceLoad() {
    let app = XCUIApplication()
    app.launch()
    
    XCTAssertTrue(app.buttons["recordButton"].exists)
    XCTAssertTrue(app.buttons["playButton"].exists)
    XCTAssertTrue(app.buttons["settingsButton"].exists)
}

// 快捷键录制测试
func testShortcutRecording() {
    let app = XCUIApplication()
    app.launch()
    
    app.typeKey("r", modifierFlags: .command)
    XCTAssertEqual(app.staticTexts["statusLabel"].label, "录制中")
}
```

### 2. 快捷键设置
```swift
// 快捷键显示测试
func testShortcutDisplay() {
    let app = XCUIApplication()
    app.launch()
    
    app.buttons["settingsButton"].tap()
    XCTAssertEqual(app.staticTexts["recordShortcutLabel"].label, "⌘R")
}

// 快捷键冲突测试
func testShortcutConflict() {
    let app = XCUIApplication()
    app.launch()
    
    app.buttons["settingsButton"].tap()
    app.buttons["editShortcutButton"].tap()
    app.typeKey("q", modifierFlags: .command)
    XCTAssertTrue(app.alerts["conflictAlert"].exists)
}
```

### 3. 图像识别
```swift
// 图像添加测试
func testImageTemplateAdd() {
    let app = XCUIApplication()
    app.launch()
    
    app.buttons["addImageButton"].tap()
    app.buttons["captureButton"].tap()
    XCTAssertTrue(app.images["templateImage"].exists)
}

// 图像识别播放测试
func testImageRecognitionPlay() {
    let app = XCUIApplication()
    app.launch()
    
    app.buttons["playButton"].tap()
    XCTAssertEqual(app.staticTexts["statusLabel"].label, "识别中")
}
```

### 4. 多语言支持
```swift
// 中文界面测试
func testChineseInterface() {
    let app = XCUIApplication()
    app.launchArguments = ["-AppleLanguages", "(zh-Hans)"]
    app.launch()
    
    XCTAssertEqual(app.buttons["recordButton"].label, "录制")
    XCTAssertEqual(app.buttons["playButton"].label, "播放")
}

// 英文界面测试
func testEnglishInterface() {
    let app = XCUIApplication()
    app.launchArguments = ["-AppleLanguages", "(en)"]
    app.launch()
    
    XCTAssertEqual(app.buttons["recordButton"].label, "Record")
    XCTAssertEqual(app.buttons["playButton"].label, "Play")
}
```

## ♿ 可访问性测试

### 1. 标签测试
```swift
// 按钮标签测试
func testButtonAccessibility() {
    let app = XCUIApplication()
    app.launch()
    
    let recordButton = app.buttons["recordButton"]
    XCTAssertNotNil(recordButton.accessibilityLabel)
    XCTAssertNotNil(recordButton.accessibilityHint)
}

// 输入框标签测试
func testTextFieldAccessibility() {
    let app = XCUIApplication()
    app.launch()
    
    let nameField = app.textFields["scriptNameField"]
    XCTAssertNotNil(nameField.accessibilityLabel)
    XCTAssertNotNil(nameField.accessibilityValue)
}
```

### 2. 键盘导航
```swift
// 键盘焦点测试
func testKeyboardNavigation() {
    let app = XCUIApplication()
    app.launch()
    
    app.typeKey(.tab, modifierFlags: [])
    XCTAssertTrue(app.buttons["recordButton"].hasKeyboardFocus)
    
    app.typeKey(.tab, modifierFlags: [])
    XCTAssertTrue(app.buttons["playButton"].hasKeyboardFocus)
}
```

## 🧪 测试环境

### 1. 设备要求
- macOS 14.0+
- Apple Silicon / Intel 架构
- 最小屏幕分辨率：1280x800
- 支持深色模式

### 2. 测试工具
- Xcode 15.0+
- Swift 5.9+
- Accessibility Inspector
- Instruments
- 自动化测试脚本

## 📊 测试指标

### 1. 性能指标
- 界面响应时间 < 100ms
- 动画帧率 > 60fps
- 内存占用 < 200MB
- CPU 使用率 < 30%

### 2. 覆盖率指标
- UI 测试覆盖率 > 90%
- 可访问性测试覆盖率 100%
- 多语言测试覆盖率 100%
- 快捷键测试覆盖率 100%

## 📝 测试文档

### 1. 测试报告
- 测试用例列表
- 测试结果统计
- 问题追踪记录
- 性能分析报告

### 2. 维护文档
- 测试脚本更新记录
- 测试环境配置说明
- 自动化测试流程
- 问题复现步骤

## 🔄 更新日志

### v1.0.0
- 初始测试规划
- 实现基础 UI 测试
- 添加可访问性测试
- 完成多语言测试

### v1.1.0
- 优化测试性能
- 增加测试覆盖率
- 完善测试文档
- 提升测试效率

## 功能測試
1. 主界面
   - [ ] 截圖按鈕功能
   - [ ] 識別按鈕功能
   - [ ] 點擊按鈕功能
   - [ ] 設置按鈕功能

2. 設置界面
   - [ ] 參數設置功能
   - [ ] 快捷鍵設置功能
   - [ ] 保存設置功能
   - [ ] 重置設置功能

3. 提示界面
   - [ ] 錯誤提示功能
   - [ ] 成功提示功能
   - [ ] 警告提示功能
   - [ ] 幫助提示功能

## 交互測試
1. 鼠標操作
   - [ ] 點擊響應
   - [ ] 拖拽功能
   - [ ] 滾動功能
   - [ ] 懸停效果

2. 鍵盤操作
   - [ ] 快捷鍵響應
   - [ ] Tab 鍵導航
   - [ ] 輸入驗證
   - [ ] 熱鍵功能

3. 手勢操作
   - [ ] 縮放功能
   - [ ] 旋轉功能
   - [ ] 滑動功能
   - [ ] 多指操作

## 兼容性測試
1. 系統版本
   - [ ] macOS 13.0
   - [ ] macOS 14.0
   - [ ] Intel Mac
   - [ ] Apple Silicon

2. 顯示設置
   - [ ] 不同分辨率
   - [ ] 不同縮放比例
   - [ ] 深色模式
   - [ ] 高對比度

3. 輔助功能
   - [ ] VoiceOver
   - [ ] 鍵盤控制
   - [ ] 顯示調節
   - [ ] 聲音提示

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - UI 元素可訪問性
  - 交互響應時間
  - 兼容性測試結果
  - 輔助功能支持
  - 主要文檔變更需自動生成變更日誌並通知團隊 