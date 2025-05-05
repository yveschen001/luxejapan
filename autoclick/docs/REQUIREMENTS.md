# AutoClicker 项目需求文档

## 🎯 项目定位
- **目标平台**：macOS（支持 Apple Silicon 和 Intel 架构）
- **开发工具**：Xcode（Swift + SwiftUI）
- **应用类型**：图形化自动点击器
- **核心功能**：录制回放、图像识别点击
- **目标用户**：需要自动化鼠标键盘操作的用户，尤其是游戏玩家
- **上架计划**：计划提交至 Mac App Store

## 💡 核心功能

### 1. 录制与回放
- 记录用户的鼠标移动、点击和键盘输入
- 支持设置延迟、重复次数和间隔时间
- 脚本以本地文件形式保存，支持导入导出
- 支持循环播放和播放速度调整
- 支持中途暂停/停止

### 2. 图像识别点击
- 用户可选择目标图像，程序在屏幕上识别并点击
- 支持设置识别间隔时间和点击次数
- 使用 macOS 的 Vision 框架或 OpenCV 实现
- 支持多图像依序识别
- 支持与脚本执行并行运行

### 3. 快捷键控制
- 用户可自定义快捷键，用于开始/停止录制和回放
- 避免与系统或其他应用的快捷键冲突
- 使用 KeyboardShortcuts 库实现全局快捷键
- 默认快捷键：
  - 开始录制：⌘+R
  - 停止录制：⌘+S
  - 播放脚本：⌘+P
  - 停止播放：⌘+E
  - 图像识别：⌘+I

### 4. 用户界面
- 采用 SwiftUI 构建现代化界面
- 提供录制、回放、图像识别等功能的可视化操作
- 支持深色模式和多语言（包括简体中文）
- 主界面包含：
  - 功能按钮
  - 快捷键预览
  - 脚本列表
  - 编辑器
  - 图像识别器
  - 设置中心
  - 日志输出

## 🔧 技术实现

### 1. 录制与回放实现
- 使用 CGEventTap 捕获鼠标和键盘事件
- 将事件序列保存为 JSON 格式的脚本文件
- 回放时读取脚本并模拟事件
- 实现事件队列缓冲机制
- 支持事件延迟和重复控制

### 2. 图像识别实现
- 使用 macOS 的 Vision 框架进行图像匹配
- 或使用 OpenCV 的模板匹配功能
- 识别到目标图像后获取坐标并模拟点击
- 实现图像缓存机制
- 支持多图像并行识别

### 3. 权限管理
- 请求"辅助功能"权限
- 应用首次启动时引导用户授予必要权限
- 实现权限状态监控
- 提供权限获取失败的处理机制

### 4. 本地存储
- **脚本存储**
  - 路径：`~/Library/Application Support/AutoClicker/scripts/`
  - 格式：JSON
  - 功能：支持导入、导出、置换

- **图像存储**
  - 路径：`~/Library/Application Support/AutoClicker/images/`
  - 格式：PNG
  - 功能：支持导入、导出、置换

### 5. 性能优化
- **录制优化**
  - 使用事件队列缓冲录制数据
  - 异步保存脚本文件
  - 限制录制频率，避免性能影响

- **图像识别优化**
  - 使用 GPU 加速图像处理
  - 实现图像缓存机制
  - 优化识别算法，降低 CPU 使用率

- **内存管理**
  - 实现事件数据的循环缓冲区
  - 及时释放不需要的图像资源
  - 监控内存使用情况

### 6. 错误处理
- **录制错误处理**
  - 事件捕获失败的重试机制
  - 脚本保存失败的备份方案
  - 用户友好的错误提示

- **图像识别错误处理**
  - 识别失败的重试策略
  - 图像加载失败的处理
  - 坐标计算错误的容错机制

- **权限错误处理**
  - 权限获取失败的重试机制
  - 降级功能方案
  - 用户引导流程

### 7. 安全性
- **脚本安全**
  - 脚本文件格式验证
  - 执行前安全检查
  - 防止恶意脚本注入

- **权限安全**
  - 最小权限原则
  - 权限使用审计
  - 敏感操作确认

- **数据安全**
  - 用户数据加密存储
  - 隐私数据保护
  - 数据备份机制

## 📁 项目结构
```
AutoClicker/
├── AppDelegate.swift
├── Assets.xcassets/
├── Base.lproj/
├── Models/
│   ├── Script.swift
│   ├── Event.swift
│   ├── ImageTemplate.swift
│   └── Shortcut.swift
├── Views/
│   ├── ContentView.swift
│   ├── RecorderView.swift
│   ├── PlayerView.swift
│   ├── ImageRecognitionView.swift
│   ├── SettingsView.swift
│   └── LogView.swift
├── ViewModels/
│   ├── RecorderViewModel.swift
│   ├── PlayerViewModel.swift
│   ├── ImageRecognitionViewModel.swift
│   └── SettingsViewModel.swift
├── Services/
│   ├── EventRecorder.swift
│   ├── EventPlayer.swift
│   ├── ImageRecognizer.swift
│   ├── StorageService.swift
│   └── PermissionService.swift
├── Resources/
│   ├── zh-Hans.lproj/
│   │   └── Localizable.strings
│   └── en.lproj/
│       └── Localizable.strings
└── Info.plist
```

## 🧪 测试策略

### 1. 单元测试
- 事件录制和回放测试
- 图像识别算法测试
- 快捷键功能测试
- 错误处理测试

### 2. UI 测试
- 界面交互测试
- 深色模式适配测试
- 多语言支持测试
- 响应式布局测试

### 3. 性能测试
- 录制性能测试
- 图像识别性能测试
- 内存使用测试
- CPU/GPU 使用率测试

### 4. 集成测试
- 功能模块集成测试
- 权限系统测试
- 数据持久化测试
- 多设备兼容性测试

## 🚀 发布准备

### 1. App Store 审核准备
- 隐私政策文档
- 应用截图和预览视频
- 应用描述和关键词
- 技术支持网址

### 2. 版本管理
- 版本号规范
- 更新日志模板
- 回滚机制
- 灰度发布策略

### 3. 监控和反馈
- 崩溃报告收集
- 用户反馈渠道
- 性能监控
- 使用统计

## 📚 参考项目
1. **KeymouseGo**
   - 提供录制和回放功能
   - 使用 Python 实现
   - 适合参考事件记录和脚本格式设计

2. **Autoclick**
   - 使用 Swift 实现的简单自动点击器
   - 界面简洁
   - 适合参考 UI 设计和权限管理

3. **macos-auto-clicker**
   - 功能丰富
   - 支持快捷键控制和多种点击设置
   - 适合参考快捷键实现和用户设置管理

## 📂 项目目录结构
```
macOSAutoClicker/
├── .cursorrules               # AI助手的行为规范
├── docs/
│   ├── SPEC.md                # 功能规格说明书
│   ├── UI_GUIDELINES.md       # UI 设计规范
│   ├── SHORTCUTS.md           # 快捷键设计
│   ├── APPSTORE_NOTES.md      # 上架注意事项
│   ├── SECURITY.md            # 安全策略说明
│   └── CONTRIBUTING.md        # 贡献指南
├── workflows/
│   ├── test_plan.yml          # 自动测试计划
│   └── build_release.yml      # 构建与发布流程
├── Scripts/
│   └── example_script.json    # 录制脚本样本
├── UI_Design/
│   └── wireframes.sketch      # 界面设计稿
├── Localization/
│   ├── zh-Hans.lproj/
│   │   └── Localizable.strings
│   └── en.lproj/
│       └── Localizable.strings
├── README.md                  # 项目说明文档
├── CHANGELOG.md              # 版本更新记录
├── Info.plist                # 应用配置文件
└── LICENSE                   # 开源许可证
```

### 目录说明

1. **文档目录 (docs/)**
   - 包含所有项目文档
   - 新增 SECURITY.md 用于安全策略说明
   - 新增 CONTRIBUTING.md 用于贡献指南

2. **工作流目录 (workflows/)**
   - 包含自动化测试和构建流程
   - 使用 GitHub Actions 进行 CI/CD

3. **脚本目录 (Scripts/)**
   - 存放示例脚本
   - 可用于测试和文档说明

4. **UI 设计目录 (UI_Design/)**
   - 存放界面设计稿
   - 支持 Figma 或 Sketch 格式

5. **本地化目录 (Localization/)**
   - 支持多语言
   - 包含简体中文和英文

6. **其他文件**
   - README.md：项目说明文档
   - CHANGELOG.md：版本更新记录
   - Info.plist：应用配置文件
   - LICENSE：开源许可证 

## 功能需求
1. 图像识别
   - 支持全屏识别
   - 支持区域识别
   - 支持窗口识别
   - 支持多目标识别

2. 点击功能
   - 支持单点点击
   - 支持多点点击
   - 支持点击序列
   - 支持延迟点击

3. 脚本功能
   - 支持脚本录制
   - 支持脚本编辑
   - 支持脚本回放
   - 支持脚本导出

## 性能需求
1. 响应时间
   - 启动时间 < 2s
   - 识别延迟 < 100ms
   - 点击延迟 < 50ms
   - 脚本加载 < 200ms

2. 资源使用
   - CPU 使用率 < 30%
   - 内存使用 < 200MB
   - 磁盘使用 < 100MB
   - 网络使用 0

3. 稳定性
   - 崩溃率 < 0.1%
   - 错误处理率 100%
   - 数据保存率 100%
   - 脚本执行率 100%

## 自动化校验要求
- PR/CI 流程需自动校验：
  - 功能需求完整性检查
  - 性能需求达标检查
  - 稳定性指标检查
  - 文档同步检查
  - 主要文档变更需自动生成变更日志并通知团队 