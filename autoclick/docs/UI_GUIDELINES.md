# AutoClicker for macOS - UI 设计指南

> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

# AutoClicker for macOS - 用户界面设计规范

## 🎯 设计目标

### 1. 用户体验
- 简洁直观的操作界面
- 符合 macOS 设计规范
- 支持深色模式
- 响应式布局
- 无障碍访问支持

### 2. 技术目标
- 支持 macOS 14.0+
- 适配 Apple Silicon 和 Intel 架构
- 高性能渲染
- 低资源占用

## 🧱 技术选型与架构

### 1. 框架选择
- **主要框架**：SwiftUI
- **架构模式**：MVVM
- **状态管理**：Combine
- **本地化**：Localizable.strings

### 2. 架构原则
```swift
// MVVM 架构示例
struct ContentView: View {
    @StateObject private var viewModel = ContentViewModel()
    
    var body: some View {
        // 视图实现
    }
}

class ContentViewModel: ObservableObject {
    @Published var state: ViewState = .idle
    
    // 业务逻辑
}
```

## 🎨 UI 组件规范

### 1. 按钮组件
```swift
// 主要按钮
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(.body, design: .rounded))
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
        }
        .buttonStyle(.borderedProminent)
    }
}

// 次要按钮
struct SecondaryButton: View {
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(.body, design: .rounded))
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
        }
        .buttonStyle(.bordered)
    }
}
```

### 2. 输入组件
```swift
// 文本输入框
struct CustomTextField: View {
    @Binding var text: String
    let placeholder: String
    
    var body: some View {
        TextField(placeholder, text: $text)
            .textFieldStyle(.roundedBorder)
            .font(.system(.body))
    }
}

// 数字输入框
struct NumberTextField: View {
    @Binding var value: Int
    let placeholder: String
    
    var body: some View {
        TextField(placeholder, value: $value, format: .number)
            .textFieldStyle(.roundedBorder)
            .font(.system(.body))
    }
}
```

### 3. 列表组件
```swift
// 脚本列表
struct ScriptList: View {
    @ObservedObject var viewModel: ScriptListViewModel
    
    var body: some View {
        List(viewModel.scripts) { script in
            ScriptRow(script: script)
        }
        .listStyle(.inset)
    }
}
```

## 🎯 布局规范

### 1. 间距规范
- 组件间距：8pt
- 内容边距：16pt
- 分组间距：24pt
- 标题间距：32pt

### 2. 尺寸规范
- 按钮最小宽度：80pt
- 按钮最小高度：32pt
- 输入框高度：32pt
- 列表行高：44pt

### 3. 响应式布局
```swift
struct ResponsiveLayout: View {
    var body: some View {
        GeometryReader { geometry in
            if geometry.size.width > 800 {
                // 宽屏布局
            } else {
                // 窄屏布局
            }
        }
    }
}
```

## 🎨 主题规范

### 1. 颜色系统
```swift
extension Color {
    static let primary = Color("Primary")
    static let secondary = Color("Secondary")
    static let background = Color("Background")
    static let text = Color("Text")
}
```

### 2. 深色模式
```swift
struct ThemeView: View {
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        // 根据 colorScheme 切换主题
    }
}
```

## 📱 界面模块

### 1. 主界面
- 功能按钮区
- 脚本列表区
- 编辑器区
- 图像识别区
- 设置中心
- 日志输出区

### 2. 设置界面
- 快捷键设置
- 主题设置
- 存储设置
- 权限设置

### 3. 编辑器界面
- 脚本时间轴
- 事件列表
- 属性编辑器
- 预览区域

## 🔍 测试规范

### 1. UI 测试
- 测试界面布局
- 测试深色模式
- 测试响应式布局
- 测试无障碍访问

### 2. 交互测试
- 测试按钮点击
- 测试输入验证
- 测试列表操作
- 测试快捷键响应

## 📝 文档规范

### 1. 设计文档
- 维护界面原型
- 更新组件库
- 记录设计决策
- 更新设计规范

### 2. 开发文档
- 记录组件实现
- 说明布局规则
- 提供示例代码
- 维护测试用例

## 🔄 更新日志

### v1.0.0
- 初始界面设计
- 实现基本组件
- 支持深色模式
- 完成响应式布局

### v1.1.0
- 优化组件库
- 改进布局系统
- 增强无障碍支持
- 提升性能表现

## 系統要求
- 支持 macOS 14.0+
- 支持 Apple Silicon 和 Intel 处理器
- 支持深色模式
- 支持多显示器

## 界面佈局
1. 主界面
   - 頂部工具欄
   - 左側功能列表
   - 右側工作區
   - 底部狀態欄

2. 功能區
   - 截圖區域
   - 識別區域
   - 點擊區域
   - 腳本區域

3. 設置區
   - 通用設置
   - 快捷鍵設置
   - 識別設置
   - 點擊設置

## 視覺風格
1. 顏色方案
   - 主色調：#007AFF
   - 輔助色：#34C759
   - 警告色：#FF3B30
   - 背景色：#F2F2F7

2. 字體規範
   - 標題：SF Pro Display
   - 正文：SF Pro Text
   - 代碼：SF Mono
   - 大小：12-24pt

3. 圖標規範
   - 線性圖標
   - 填充圖標
   - 系統圖標
   - 自定義圖標

## 交互設計
1. 操作反饋
   - 懸停效果
   - 點擊效果
   - 拖拽效果
   - 動畫過渡

2. 狀態提示
   - 加載狀態
   - 錯誤狀態
   - 成功狀態
   - 警告狀態

3. 快捷操作
   - 右鍵菜單
   - 快捷鍵
   - 手勢操作
   - 拖拽操作

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - 界面佈局一致性檢查
  - 視覺風格規範檢查
  - 交互設計規範檢查
  - 主要文檔變更需自動生成變更日誌並通知團隊 