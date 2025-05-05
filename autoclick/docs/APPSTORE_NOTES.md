# AutoClicker for macOS - App Store 上架规范

> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

## 🎯 上架目标

### 1. 应用定位
- 类别：工具类、效率类应用
- 平台：macOS（支持 Apple Silicon 和 Intel 架构）
- 目标用户：需要自动化鼠标键盘操作的用户
- 主要功能：录制回放、图像识别点击
- 特色功能：
  - 智能图像识别
  - 多脚本管理
  - 快捷键控制
  - 实时状态反馈

### 2. 应用场景
- 游戏辅助
- 自动化任务执行
- UI 测试模拟
- 重复性操作自动化
- 数据录入自动化
- 批量操作处理

## 🔐 权限声明与隐私政策

### 1. 辅助功能（Accessibility）
- **用途**：模拟鼠标与键盘操作
- **权限位置**：系统设置 → 隐私与安全性 → 辅助使用
- **技术实现**：
  ```swift
  // 请求辅助功能权限
  let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true]
  let accessEnabled = AXIsProcessTrustedWithOptions(options as CFDictionary)
  ```
- **用户引导**：
  - 首次启动时显示权限请求
  - 提供图文引导说明
  - 支持一键跳转系统设置
  - 权限状态实时监控
  - 权限丢失自动提醒

### 2. 屏幕截图（可选）
- **用途**：图像识别模板采集
- **技术实现**：
  ```swift
  // 使用 ScreenCaptureKit 截取屏幕
  let captureSession = SCStreamConfiguration()
  captureSession.width = screenWidth
  captureSession.height = screenHeight
  captureSession.minimumFrameInterval = CMTime(value: 1, timescale: 60)
  ```
- **数据存储**：
  - 路径：`~/Library/Application Support/AutoClicker/images/`
  - 格式：PNG
  - 处理：仅本地处理，不上传
  - 加密：使用系统密钥链加密敏感数据

### 3. 本地存储与隐私
- **存储位置**：
  - 脚本：`~/Library/Application Support/AutoClicker/scripts/`
  - 图像：`~/Library/Application Support/AutoClicker/images/`
  - 配置：`~/Library/Application Support/AutoClicker/config/`
- **隐私保护**：
  - 不使用网络功能
  - 不收集用户数据
  - 无用户账户
  - 无登录机制
  - 无第三方追踪器
  - 数据本地加密存储
  - 定期清理临时文件

## 🧭 App Store 审核规范

### 1. 权限描述
```swift
// Info.plist 权限描述
<key>NSAccessibilityUsageDescription</key>
<string>本应用需启用辅助功能，以模拟鼠标与键盘操作。</string>
<key>NSAppleEventsUsageDescription</key>
<string>用于脚本控制其他应用。</string>
<key>NSCameraUsageDescription</key>
<string>用于图像模板采集与识别。</string>
<key>NSMicrophoneUsageDescription</key>
<string>（如需录音功能时补充）</string>
<key>NSScreenCaptureUsageDescription</key>
<string>用于屏幕截图与图像识别。</string>
<key>NSDocumentsFolderUsageDescription</key>
<string>用于保存脚本和图像模板。</string>
```

### 2. UI 设计规范
- **深色模式支持**：
  ```swift
  // 支持深色模式
  @Environment(\.colorScheme) var colorScheme
  ```
- **标准控件使用**：
  - 使用 NSButton 标准样式
  - 遵循 macOS 设计规范
  - 截圖功能全面升級為 ScreenCaptureKit，支援 macOS 14.0+，所有截圖皆為高效能、權限合規，無舊 CGWindowListCreateImage 依賴。
  - 提供视觉反馈（所有主要操作按钮点击后有高亮、动画或状态提示）
  - 支持取消操作
  - 所有交互均有无障碍支持（accessibilityIdentifier、label、hint）
  - 支持键盘导航
  - 提供上下文菜单
  - 支持拖放操作

### 3. 安全性合规
- **沙盒配置**：
  ```swift
  // 启用沙盒
  <key>com.apple.security.app-sandbox</key>
  <true/>
  <key>com.apple.security.files.user-selected.read-write</key>
  <true/>
  <key>com.apple.security.files.downloads.read-write</key>
  <true/>
  ```
- **公证要求**：
  - 使用开发者 ID 签名
  - 通过 App Notarization
  - 配置 Gatekeeper
  - 定期更新证书
  - 监控签名状态
- **安全声明**：
  - 不使用未授权 API
  - 不含网络功能
  - 不收集用户数据
  - 不含后台进程、键盘监听、文件监控等敏感行为
  - 定期安全审计
  - 漏洞修复机制

## 🧪 测试规范

### 1. 权限测试
- 测试辅助功能开启/关闭
- 测试权限获取失败处理
- 测试权限状态监控
- 测试权限恢复机制
- 测试权限变更通知
- 测试权限丢失处理

### 2. 本地化测试
- 测试多语言环境
- 测试 RTL 布局
- 测试日期时间格式
- 测试数字格式
- 测试货币格式
- 测试文本方向

### 3. 功能测试
- 测试脚本录制回放
- 测试图像识别功能
- 测试快捷键系统
- 测试本地存储
- 测试错误处理
- 测试状态恢复

### 4. 性能测试
- 测试内存使用
- 测试 CPU 占用
- 测试电池影响
- 测试响应时间
- 测试并发处理
- 测试资源释放

## 📝 上架准备

### 1. 应用信息
- 应用名称：AutoClicker
- 类别：工具类
- 价格：免费
- 年龄分级：4+
- 支持语言：简体中文、英文
- 应用大小：< 50MB
- 最低系统要求：macOS 14.0

### 2. 营销材料
- 应用截图（中英文）
  - 主界面
  - 录制界面
  - 设置界面
  - 脚本管理
- 预览视频
  - 功能演示
  - 使用教程
- 应用描述
  - 功能特点
  - 使用场景
  - 系统要求
- 关键词设置
  - 自动化
  - 鼠标点击
  - 键盘操作
  - 效率工具

### 3. 技术支持
- 技术支持网址
- 隐私政策链接
- 用户指南
- 常见问题解答
- 更新日志
- 反馈渠道

## 🔄 更新日志

### v1.0.0
- 初始版本上架
- 实现基本录制回放功能
- 支持图像识别点击
- 提供快捷键控制

### v1.1.0
- 优化权限请求流程
- 改进用户引导界面
- 增强本地化支持
- 提升性能表现

### v1.2.0
- 升级截图功能至 ScreenCaptureKit
- 优化图像识别算法
- 改进脚本管理界面
- 增强错误处理机制

## 系統要求
- macOS 14.0 或更高版本
- 支援 Apple Silicon 和 Intel 處理器
- 需要輔助功能權限
- 需要螢幕錄製權限
- 建議 8GB 以上記憶體
- 建議 500MB 以上硬碟空間

## App Store 發布指南

## 應用信息
1. 基本信息
   - 應用名稱：AutoClicker
   - Bundle ID：com.example.autoclicker
   - 版本號：1.0.0
   - 構建號：1

2. 分類信息
   - 主分類：工具
   - 副分類：效率
   - 年齡分級：4+
   - 價格：免費

3. 本地化信息
   - 支持語言：中文、英文
   - 關鍵詞：自動點擊、圖像識別
   - 描述：智能自動點擊工具
   - 更新說明：首次發布

## 審核準備
1. 隱私政策
   - 數據收集說明
   - 數據使用說明
   - 數據保護措施
   - 用戶權利說明

2. 應用截圖
   - 主界面截圖
   - 設置界面截圖
   - 功能演示截圖
   - 使用說明截圖

3. 審核信息
   - 測試賬號
   - 測試說明
   - 演示視頻
   - 補充說明

## 發布流程
1. 提交準備
   - 代碼簽名
   - 打包歸檔
   - 上傳二進制
   - 填寫信息

2. 審核過程
   - 提交審核
   - 審核跟蹤
   - 問題處理
   - 審核通過

3. 發布管理
   - 版本發布
   - 分階段發布
   - 問題監控
   - 用戶反饋

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - 版本號一致性
  - 本地化完整性
  - 隱私政策更新
  - 截圖規範性
  - 主要文檔變更需自動生成變更日誌並通知團隊 