# AutoClicker for macOS - 安全策略

> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

# AutoClicker for macOS - 安全与隐私政策

## 🎯 安全目标

### 1. 数据安全
- 本地数据存储
- 无网络传输
- 无用户追踪
- 无敏感信息

### 2. 权限控制
- 最小权限原则
- 明确权限说明
- 用户可控授权
- 沙盒限制

## 🔐 数据管理

### 1. 存储规范
```swift
// 数据存储路径
let appSupportPath = "~/Library/Application Support/AutoClicker/"
let scriptsPath = "\(appSupportPath)/scripts/"
let imagesPath = "\(appSupportPath)/images/"
let logsPath = "\(appSupportPath)/logs/"

// 文件访问控制
func ensureDirectoryExists(_ path: String) throws {
    let url = URL(fileURLWithPath: path)
    try FileManager.default.createDirectory(
        at: url,
        withIntermediateDirectories: true,
        attributes: [.protectionKey: FileProtectionType.complete]
    )
}
```

### 2. 数据范围
| 数据类型 | 存储位置 | 访问控制 |
|----------|----------|----------|
| 脚本文件 | scripts/ | 仅应用访问 |
| 图像模板 | images/ | 仅应用访问 |
| 日志文件 | logs/ | 仅应用访问 |

## 🧰 权限管理

### 1. 辅助功能
```swift
// 权限检查
func checkAccessibilityPermission() -> Bool {
    let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true]
    return AXIsProcessTrustedWithOptions(options as CFDictionary)
}

// 权限请求
func requestAccessibilityPermission() {
    let alert = NSAlert()
    alert.messageText = "需要辅助功能权限"
    alert.informativeText = "为了模拟鼠标和键盘输入，需要启用辅助功能权限。"
    alert.addButton(withTitle: "前往设置")
    alert.addButton(withTitle: "取消")
    
    if alert.runModal() == .alertFirstButtonReturn {
        NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!)
    }
}
```

### 2. 屏幕录制
```swift
// 权限检查
func checkScreenRecordingPermission() -> Bool {
    return CGPreflightScreenCaptureAccess()
}

// 权限请求
func requestScreenRecordingPermission() {
    let alert = NSAlert()
    alert.messageText = "需要屏幕录制权限"
    alert.informativeText = "为了进行图像识别，需要启用屏幕录制权限。"
    alert.addButton(withTitle: "前往设置")
    alert.addButton(withTitle: "取消")
    
    if alert.runModal() == .alertFirstButtonReturn {
        NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenRecording")!)
    }
}
```

## 🧳 沙盒配置

### 1. 权限声明
```xml
<!-- Info.plist -->
<key>com.apple.security.app-sandbox</key>
<true/>

<key>com.apple.security.files.user-selected.read-write</key>
<true/>

<key>com.apple.security.files.downloads.read-write</key>
<false/>

<key>com.apple.security.network.client</key>
<false/>
```

### 2. 文件访问
```swift
// 文件选择器
func selectFile() -> URL? {
    let panel = NSOpenPanel()
    panel.allowsMultipleSelection = false
    panel.canChooseDirectories = false
    panel.canChooseFiles = true
    
    guard panel.runModal() == .OK else { return nil }
    return panel.url
}
```

## 🚫 安全限制

### 1. 禁止行为
- 键盘监听
- 网络通信
- 自动启动
- 后台进程
- 数据收集
- 文件监控

### 2. 代码检查
```swift
// 安全检查
func performSecurityCheck() throws {
    // 检查网络调用
    guard !containsNetworkCalls() else {
        throw SecurityError.networkCallDetected
    }
    
    // 检查文件访问
    guard !containsUnauthorizedFileAccess() else {
        throw SecurityError.unauthorizedFileAccess
    }
    
    // 检查权限声明
    guard containsRequiredPermissionDeclarations() else {
        throw SecurityError.missingPermissionDeclaration
    }
}
```

## ✅ App Store 合规

### 1. 隐私声明
- 无账号系统
- 无网络功能
- 无数据收集
- 无追踪工具
- 无敏感处理

### 2. 权限说明
- 辅助功能：模拟输入
- 屏幕录制：图像识别
- 文件访问：脚本存储

## 📊 安全监控

### 1. 监控指标
- 权限状态
- 文件访问
- 内存使用
- 进程行为

### 2. 日志记录
```swift
func logSecurityEvent(_ event: SecurityEvent) {
    LogManager.shared.security("""
        Security Event:
        - Type: \(event.type)
        - Time: \(event.timestamp)
        - Details: \(event.details)
        """)
}
```

## 🔄 更新日志

### v1.0.0
- 初始安全策略
- 实现权限管理
- 配置沙盒环境
- 完成安全检查

### v1.1.0
- 增强权限控制
- 完善安全监控
- 优化日志系统
- 提升合规性

## 🔗 交叉引用声明

- 本文档需与以下文档保持一致性与联动：
  - `APPSTORE_NOTES.md`：上架合规性需与安全规范联动
  - `QA_AUTOCHECK.md`：自动验收规则需与安全规范联动
  - `.cursorrules`：AI 生成代码需符合本规范

- 变更本文件时，建议自动通知相关文档维护者/负责人。

## 🤖 自动化校验要求

- PR/CI 流程需自动校验：
  - 权限声明、敏感操作、合规性检查与本规范一致
  - 主要文档变更需自动生成变更日志并通知团队 