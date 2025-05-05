# AutoClicker for macOS - 環境配置規範

> 📁 本文件定義了開發環境的配置標準
> 📅 最後修改時間：2025-05-04 00:06

## 🏗 目錄結構

### 1. 標準目錄結構
```
AutoClicker/
├── AutoClicker/              # 主項目代碼
│   ├── App/                 # 應用程序入口
│   ├── Views/              # 視圖層
│   ├── ViewModels/         # 視圖模型層
│   ├── Models/             # 數據模型層
│   ├── Services/           # 服務層
│   ├── Utils/              # 工具類
│   └── Resources/          # 資源文件
├── AutoClickerTests/        # 單元測試
├── docs/                    # 文檔
├── scripts/                 # 腳本文件
└── .github/                 # GitHub 配置
```

### 2. 目錄規範
- 所有代碼必須位於 `AutoClicker/` 目錄下
- 測試代碼必須位於 `AutoClickerTests/` 目錄下
- 文檔必須位於 `docs/` 目錄下
- 腳本必須位於 `scripts/` 目錄下

### 3. 開發檢查清單
每次開始開發前，請檢查：
1. 是否在正確的目錄結構中
2. 是否遵循 MVVM 架構
3. 是否添加了必要的測試
4. 是否更新了相關文檔

### 4. 目錄檢查腳本
```bash
#!/bin/bash
# 檢查目錄結構
if [ ! -d "AutoClicker" ]; then
    echo "❌ 錯誤：缺少 AutoClicker 目錄"
    exit 1
fi

if [ ! -d "AutoClickerTests" ]; then
    echo "❌ 錯誤：缺少 AutoClickerTests 目錄"
    exit 1
fi

if [ ! -d "docs" ]; then
    echo "❌ 錯誤：缺少 docs 目錄"
    exit 1
fi

if [ ! -d "scripts" ]; then
    echo "❌ 錯誤：缺少 scripts 目錄"
    exit 1
fi

echo "✅ 目錄結構檢查通過"
```

## 🔄 更新日誌

### v1.0.0
- 初始環境配置規範
- 定義目錄結構
- 建立檢查清單
- 添加檢查腳本

### v1.1.0
- 優化目錄結構
- 完善檢查清單
- 更新檢查腳本
- 添加文檔規範

## 📁 文档引用规范

### 1. 核心文档
- `SPEC.md` - 功能规范
- `UI_GUIDELINES.md` - UI 设计指南
- `QA_AUTOCHECK.md` - 自动化测试规范
- `SHORTCUTS.md` - 快捷键规范
- `DATA_SCHEMA.md` - 数据模型规范
- `IMAGE_RECOGNITION_RULES.md` - 图像识别规范
- `APPSTORE_NOTES.md` - App Store 上架规范
- `PROJECT_SYNC_PLAN.md` - 项目同步规范
- `SECURITY_POLICY.md` - 安全策略
- `STYLE_GUIDE.md` - 代码风格指南
- `CONTRIBUTING.md` - 贡献指南
- `FINAL_CHECKLIST.md` - 最终检查清单
- `LocalTestPlan.md` - 本地测试计划
- `UI_TESTS_PLAN.md` - UI 测试计划
- `NEXT_TASKS.md` - 任务追踪

### 2. 引用方式
所有文档应在开头使用以下格式引用本配置：
```markdown
> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06
```

## 🛠 开发环境配置

### 1. 目录结构
```
autoclick/
├── AutoClicker/             # 主程序目录
│   ├── App/                 # AppDelegate 與 App 入口點
│   ├── Views/               # SwiftUI 視圖元件模組
│   ├── ViewModels/          # 對應的邏輯控制層
│   ├── Models/              # 結構定義
│   ├── Services/            # 功能模組
│   ├── Resources/           # 資源文件
│   ├── Assets.xcassets/     # 圖片資源
│   ├── Info.plist           # 應用配置
│   └── README.md            # 項目說明
├── AutoClickerTests/        # 單元測試模組
├── docs/                    # 開發文檔
├── Tools/                   # 開發工具腳本
├── scripts/                 # 自動化腳本
├── .github/                 # GitHub 配置
├── .cursorrules            # Cursor 規則
├── .swiftlint.yml          # SwiftLint 配置
├── Package.swift           # Swift Package Manager 配置
└── PROMPT_CHEATSHEET.md    # 提示詞參考
```

### 2. 开发工具
- Xcode 15+
- SwiftLint
- SwiftFormat
- Fastlane
- Instruments
- Console.app
- Network Link Conditioner
- Localization Editor

### 3. 测试工具
- XCTest
- XCUITest
- Instruments
- GitHub Actions
- Performance Testing
- UI Testing
- Integration Testing
- Localization Testing

## 📊 性能指标

### 1. 响应时间
- 启动时间 < 2s
- 录制延迟 < 50ms
- 图像识别 < 100ms
- 快捷键响应 < 10ms
- 脚本加载 < 200ms
- 图像加载 < 100ms
- 事件处理 < 20ms
- 本地化加载 < 100ms

### 2. 资源使用
- CPU 使用率 < 30%
- 内存使用 < 200MB
- 电池影响 < 5%
- 磁盘使用 < 100MB
- 网络使用 0
- GPU 使用率 < 20%
- 文件 I/O < 10MB/s
- 本地化资源 < 10MB

### 3. 稳定性
- 崩溃率 < 0.1%
- 错误处理率 100%
- 数据保存成功率 100%
- 快捷键响应率 100%
- 图像识别准确率 > 95%
- 脚本执行成功率 100%
- 权限获取成功率 100%
- 本地化加载成功率 100% 