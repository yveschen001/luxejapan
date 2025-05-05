# AutoClicker for macOS - 项目同步规范

> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

## 🎯 同步目标

### 1. 开发环境
- 统一 Xcode 和 Cursor 的项目结构
- 避免文件重复或丢失
- 确保自动化工具正常运行
- 支持文档规范与自动化执行
- 保持目录结构一致性
- 确保文件路径正确性
- 维护测试模块完整性
- 支持多语言开发

### 2. 目录结构
```
autoclick/
├── AutoClicker/             # 主程序目录
│   ├── App/                 # AppDelegate 與 App 入口點
│   │   ├── AppDelegate.swift     # macOS App 代理
│   │   └── AutoClickerApp.swift  # @main 入口點
│   ├── Views/               # SwiftUI 視圖元件模組
│   │   ├── MainView.swift       # 主視圖
│   │   ├── RecorderView.swift   # 錄製視圖
│   │   ├── ImageMatchView.swift # 圖像識別視圖
│   │   └── SettingsView.swift   # 設定視圖
│   ├── ViewModels/          # 對應的邏輯控制層
│   │   ├── MainViewModel.swift  # 主視圖模型
│   │   ├── RecorderViewModel.swift # 錄製視圖模型
│   │   └── ImageMatchViewModel.swift # 圖像識別視圖模型
│   ├── Models/              # 結構定義
│   │   ├── Script.swift         # 腳本模型
│   │   └── ScriptAction.swift   # 腳本動作模型
│   ├── Services/            # 功能模組
│   │   ├── ScriptStorageService.swift # 腳本存儲服務
│   │   ├── ModernScreenCaptureService.swift # 圖像識別服務（ScreenCaptureKit，async/await，無 CGWindowListCreateImage）
│   │   └── AccessibilityEventService.swift # 輔助功能服務
│   ├── Resources/           # 資源文件
│   │   └── Localizable.strings  # 本地化文件
│   ├── Assets.xcassets/     # 圖片資源
│   │   └── AppIcon.appiconset/  # App 圖標
│   ├── Info.plist           # 應用配置
│   └── README.md            # 項目說明
├── AutoClickerTests/        # 單元測試模組
├── docs/                    # 開發文檔
│   ├── APPSTORE_NOTES.md    # App Store 上架規範
│   ├── CONTRIBUTING.md      # 貢獻指南
│   ├── DATA_SCHEMA.md       # 數據模型規範
│   ├── FINAL_CHECKLIST.md   # 最終檢查清單
│   ├── IMAGE_RECOGNITION_RULES.md # 圖像識別規範
│   ├── LocalTestPlan.md     # 本地測試計劃
│   ├── NEXT_TASKS.md        # 任務追蹤
│   ├── PROJECT_SYNC_PLAN.md # 項目同步規範
│   ├── QA_AUTOCHECK.md      # 自動化測試規範
│   ├── SECURITY_POLICY.md   # 安全策略
│   ├── SHORTCUTS.md         # 快捷鍵規範
│   ├── SPEC.md              # 功能規範
│   ├── STYLE_GUIDE.md       # 代碼風格指南
│   ├── UI_GUIDELINES.md     # UI 設計指南
│   └── UI_TESTS_PLAN.md     # UI 測試計劃
├── Tools/                   # 開發工具腳本
├── scripts/                 # 自動化腳本
├── .github/                 # GitHub 配置
├── .cursorrules            # Cursor 規則
├── .swiftlint.yml          # SwiftLint 配置
├── Package.swift           # Swift Package Manager 配置
└── PROMPT_CHEATSHEET.md    # 提示詞參考
```

## 🔄 同步条件检查

### 1. 文件检查
| 项目 | 检查方法 | 说明 | 自动修复 |
|------|----------|------|----------|
| 文件实体存在 | `tree -L 2` | 确认文件夹与文件在正确位置 | 自动创建缺失目录 |
| 加入 Xcode 项目 | Project Navigator | 检查是否已加入文件夹与文件 | 自动添加文件 |
| 使用 folder reference | Add Files 时勾选 | 必须勾选 "Create folder references" | 自动设置引用 |
| 加入正确 target | File Inspector | Target Membership 中勾选正确 | 自动设置 target |
| 避免虚拟 group | 使用 folder reference | 黄色文件夹易导致 Cursor 找不到文件 | 自动转换引用 |
| 避免多层包裹 | 检查目录结构 | 不应存在 AutoClicker/AutoClicker/... | 自动修复路径 |

### 2. 测试模块
| 目录 | 用途 | 建立方式 | 自动检查 |
|------|------|----------|----------|
| AutoClickerTests/ | 单元测试（XCTest） | 由 Xcode 自动产生 | 检查测试覆盖率 |
| AutoClickerUITests/ | UI 测试（XCTest + XCUITest） | 由 Xcode 自动产生 | 检查 UI 测试完整性 |

> ⚠️ 注意：请勿手动建立 /Tests/ 或放入主要逻辑文件到测试目录中。测试模块与主程序逻辑分离管理。
> 📅 最後修改時間：2025-05-04 00:06

## 📅 定期检查

### 1. 每周检查
| 项目 | 频率 | 检查方法 | 自动修复 |
|------|------|----------|----------|
| .xcodeproj 结构 | 每周一 | 对照目录树检查 | 自动同步结构 |
| .md 文件对应 | 新功能开发前 | 检查文档与代码一致性 | 自动更新文档 |
| Target Membership | 新增文件后 | 立即检查勾选状态 | 自动设置成员 |
| 多层文件夹包裹 | 新增项目时 | 清查目录结构 | 自动修复路径 |

### 2. 开发参考文档
请所有 .swift 文件与模块逻辑、画面、测试对应以下文档进行验证与产出：
- `docs/SPEC.md` - 功能规范
- `docs/UI_GUIDELINES.md` - UI 设计指南
- `docs/QA_AUTOCHECK.md` - 自动化测试规范
- `docs/SHORTCUTS.md` - 快捷键规范
- `docs/DATA_SCHEMA.md` - 数据模型规范
- `docs/IMAGE_RECOGNITION_RULES.md` - 图像识别规范
- `docs/APPSTORE_NOTES.md` - App Store 上架规范
- `docs/PROJECT_SYNC_PLAN.md` - 项目同步规范（本文件）

## 🔗 交叉引用声明

- 本文档需与以下文档保持一致性与联动：
  - `CONTRIBUTING.md`：开发流程需与同步规范联动
  - `STYLE_GUIDE.md`：文件结构需与同步规范一致
  - `.cursorrules`：AI 生成代码需符合本规范
  - `QA_AUTOCHECK.md`：自动验收规则需与同步规范联动
  - `UI_TESTS_PLAN.md`：UI 测试需与目录结构一致

- 变更本文件时，建议自动通知相关文档维护者/负责人。

## 🤖 自动化校验要求

- PR/CI 流程需自動校驗：
  - 目錄結構、文件路径与本规范一致
  - 主要文档变更需自动生成变更日志并通知团队
  - 测试模块完整性检查
  - 文件引用关系检查
  - 文档一致性检查
  - 檢查所有 Service/Manager/單例類別 static let shared 屬性與 class 宣告，不可加上 @MainActor 或任何 actor 隔離標註，僅允許標註於 method。

## 📝 更新日志

### v1.0.0
- 初始同步规范
- 定义目录结构
- 制定检查流程
- 完善文档引用

### v1.1.0
- 优化检查流程
- 完善文档结构
- 增加自动化支持
- 提升同步效率

### v1.2.0
- 增加自动修复功能
- 完善目录结构说明
- 优化测试模块规范
- 增强自动化校验

## 🔚 结尾提示

若使用 Cursor 自动开发，请将本文件载入项目中，并于 `.cursorrules` 中开头说明引用本规范：

```markdown
> 📁 本项目的开发结构与生成规则请参照：docs/PROJECT_SYNC_PLAN.md
> 📅 最後修改時間：2025-05-04 00:06
```

## 🔄 自动修复流程

### 1. 目录结构修复
```bash
# 检查目录结构
tree -L 2

# 自动修复缺失目录
mkdir -p App Views ViewModels Models Services Assets.xcassets/AppIcon.appiconset docs

# 自动修复文件引用
find . -type f -name "*.swift" -exec xcrun swiftformat {} \;
```

### 2. 测试模块修复
```bash
# 检查测试模块
xcodebuild test -scheme AutoClicker -destination 'platform=macOS'

# 自动修复测试覆盖率
xcrun xccov view --report --json AutoClicker.xcodeproj
```

### 3. 文档同步修复
```bash
# 检查文档一致性
find docs -name "*.md" -exec grep -l "PROJECT_SYNC_PLAN.md" {} \;

# 自动更新文档引用
find . -type f -name "*.md" -exec sed -i '' 's/old_path/new_path/g' {} \;
```

### 模組管理同步
- [ ] 同步模組生成功能
- [ ] 同步模組擴充功能
- [ ] 同步模組合併功能
- [ ] 同步規範檢查功能 