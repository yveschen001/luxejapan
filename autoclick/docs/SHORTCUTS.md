# AutoClicker for macOS - 快捷键规范

> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

# AutoClicker 快捷键设计规范

## 🎯 设计原则

### 1. 用户友好性
- 所有快捷键都支持用户自定义
- 避免与 macOS 系统快捷键冲突
- 提供图形化设置界面
- 支持快捷键重置功能

### 2. 技术实现
- 使用 Apple 原生方法注册快捷键
- 支持全局快捷键监听
- 快捷键修改即时生效
- 应用启动时自动恢复设置

### 3. 存储管理
- 使用 `UserDefaults` 存储设置
- 支持快捷键配置导入导出
- 提供快捷键冲突检测
- 实现快捷键状态持久化

## ⌨️ 默认快捷键设置

### 1. 录制控制
| 功能 | 默认快捷键 | 可自定义 | 说明 |
|------|------------|----------|------|
| 开始录制 | ⌘+R | ✅ | 进入录制模式，捕捉用户操作 |
| 停止录制 | ⌘+S | ✅ | 结束录制并保存脚本 |
| 播放脚本 | ⌘+P | ✅ | 播放当前脚本内容 |
| 停止播放 | ⌘+E | ✅ | 中止脚本执行 |

### 2. 图像识别
| 功能 | 默认快捷键 | 可自定义 | 说明 |
|------|------------|----------|------|
| 启动图像识别 | ⌘+I | ✅ | 执行默认图像扫描与自动点击 |
| 暂停识别 | ⌘+Shift+I | ✅ | 暂停当前图像识别任务 |
| 继续识别 | ⌘+Option+I | ✅ | 继续暂停的图像识别任务 |

### 3. 界面控制
| 功能 | 默认快捷键 | 可自定义 | 说明 |
|------|------------|----------|------|
| 显示/隐藏主界面 | ⌘+Shift+M | ✅ | 快速呼出主界面 |
| 打开设置中心 | ⌘+, | ✅ | 打开应用设置界面 |
| 切换深色模式 | ⌘+Shift+D | ✅ | 切换应用主题模式 |

## 🧩 技术实现

### 1. 快捷键注册
```swift
// 使用 KeyboardShortcuts 库注册全局快捷键
import KeyboardShortcuts

extension KeyboardShortcuts.Name {
    static let startRecording = Self("startRecording")
    static let stopRecording = Self("stopRecording")
    static let playScript = Self("playScript")
    static let stopPlayback = Self("stopPlayback")
    static let imageRecognition = Self("imageRecognition")
}

// 注册快捷键
KeyboardShortcuts.onKeyDown(for: .startRecording) {
    // 开始录制逻辑
}
```

### 2. 快捷键存储
```swift
// 使用 UserDefaults 存储快捷键设置
extension UserDefaults {
    struct Shortcuts {
        static let startRecording = "shortcut_startRecording"
        static let stopRecording = "shortcut_stopRecording"
        static let playScript = "shortcut_playScript"
        static let stopPlayback = "shortcut_stopPlayback"
        static let imageRecognition = "shortcut_imageRecognition"
    }
    
    func setShortcut(_ shortcut: String, forKey key: String) {
        set(shortcut, forKey: key)
        synchronize()
    }
}
```

### 3. 快捷键管理
```swift
// 快捷键管理器
class ShortcutManager {
    static let shared = ShortcutManager()
    
    private init() {}
    
    func registerAllShortcuts() {
        // 注册所有快捷键
    }
    
    func updateShortcut(_ shortcut: String, for action: String) {
        // 更新快捷键设置
    }
    
    func resetToDefaults() {
        // 重置为默认设置
    }
}
```

## 🔍 测试规范

### 1. 单元测试
- 测试快捷键注册功能
- 测试快捷键存储功能
- 测试快捷键冲突检测
- 测试快捷键重置功能

### 2. UI 测试
- 测试快捷键设置界面
- 测试快捷键冲突提示
- 测试快捷键即时生效
- 测试快捷键持久化

### 3. 集成测试
- 测试快捷键与应用功能集成
- 测试快捷键与系统快捷键冲突
- 测试快捷键配置导入导出
- 测试快捷键状态恢复

## 📝 文档规范

### 1. 用户文档
- 维护快捷键说明文档
- 提供快捷键设置指南
- 记录常见问题解答
- 更新快捷键变更日志

### 2. 开发文档
- 记录快捷键实现细节
- 说明快捷键存储机制
- 提供快捷键 API 文档
- 维护快捷键测试文档

## 🔄 更新日志

### v1.0.0
- 初始快捷键设置
- 支持快捷键自定义
- 实现快捷键存储
- 添加快捷键冲突检测

### v1.1.0
- 新增图像识别快捷键
- 优化快捷键注册机制
- 改进快捷键冲突处理
- 添加快捷键重置功能

## 🔗 交叉引用声明

- 本文档需与以下文档保持一致性与联动：
  - `CONTRIBUTING.md`：快捷键相关开发需校验一致性
  - `QA_AUTOCHECK.md`：快捷键相关验收需校验一致性
  - `UI_GUIDELINES.md`：界面与快捷键联动需校验一致性
  - `.cursorrules`：AI 生成快捷键需符合本规范

- 变更本文件时，建议自动通知相关文档维护者/负责人。

## 🤖 自动化校验要求

- PR/CI 流程需自动校验：
  - 快捷键唯一性、可用性、文档同步与本规范一致
  - 主要文档变更需自动生成变更日志并通知团队 

# 快捷鍵指南

## 全局快捷鍵
1. 截圖快捷鍵
   - Command + Shift + 1：截取全屏
   - Command + Shift + 2：截取區域
   - Command + Shift + 3：截取窗口

2. 識別快捷鍵
   - Command + Option + 1：開始識別
   - Command + Option + 2：停止識別
   - Command + Option + 3：暫停識別

3. 點擊快捷鍵
   - Command + Control + 1：單點點擊
   - Command + Control + 2：多點點擊
   - Command + Control + 3：點擊序列

## 編輯快捷鍵
1. 腳本編輯
   - Command + S：保存腳本
   - Command + O：打開腳本
   - Command + N：新建腳本
   - Command + W：關閉腳本

2. 文本編輯
   - Command + X：剪切
   - Command + C：複製
   - Command + V：粘貼
   - Command + Z：撤銷

3. 視圖控制
   - Command + Equal：放大
   - Command + Minus：縮小
   - Command + 0：重置縮放
   - Command + F：搜索

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - 快捷鍵唯一性檢查
  - 快捷鍵可用性檢查
  - 快捷鍵文檔同步
  - 快捷鍵衝突檢測
  - 主要文檔變更需自動生成變更日誌並通知團隊 