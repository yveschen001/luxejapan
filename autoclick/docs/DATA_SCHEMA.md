> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

# AutoClicker for macOS - 脚本数据格式规范

## 🎯 规范目标

### 1. 数据存储
- 脚本存储路径：`~/Library/Application Support/AutoClicker/scripts/`
- 图像存储路径：`~/Library/Application Support/AutoClicker/images/`
- 文件编码：UTF-8 with BOM
- 文件格式：JSON

### 2. 规范要求
- 版本控制
- 数据完整性
- 可测试性
- 可维护性
- 向后兼容

## 📦 脚本格式

### 1. 基础结构
```json
{
  "version": "1.0",
  "name": "My Recorded Script",
  "createdAt": "2025-05-02T14:35:21Z",
  "actions": []
}
```

### 2. 字段说明
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| version | string | 是 | 脚本版本号 |
| name | string | 是 | 脚本名称 |
| createdAt | string | 是 | 创建时间（ISO 8601） |
| actions | array | 是 | 动作序列 |

## 🖱️ 鼠标动作

### 1. 移动动作
```json
{
  "type": "mouse",
  "event": "move",
  "position": [400, 300],
  "delay": 0
}
```

### 2. 点击动作
```json
{
  "type": "mouse",
  "event": "leftClick",
  "position": [400, 300],
  "delay": 200
}
```

## ⌨️ 键盘动作

### 1. 按键动作
```json
{
  "type": "keyboard",
  "event": "keyDown",
  "keyCode": 36,
  "keyLabel": "Return",
  "delay": 100
}
```

### 2. 组合键动作
```json
{
  "type": "keyboard",
  "event": "keyDown",
  "keyCode": 36,
  "keyLabel": "Return",
  "modifiers": ["command", "shift"],
  "delay": 100
}
```

## 🖼️ 图像识别动作

### 1. 基础识别
```json
{
  "type": "image",
  "imageId": "login_button",
  "action": "clickCenter",
  "matchThreshold": 0.85,
  "maxRetries": 3,
  "interval": 500,
  "delay": 0
}
```

### 2. 高级识别
```json
{
  "type": "image",
  "imageId": "login_button",
  "action": "clickCenter",
  "matchThreshold": 0.85,
  "maxRetries": 3,
  "interval": 500,
  "delay": 0,
  "region": [100, 100, 200, 200],
  "confidence": 0.95
}
```

## 🔍 数据验证

### 1. 类型检查
```swift
// 脚本验证
func validateScript(_ script: Script) throws {
    guard script.version == "1.0" else {
        throw ScriptError.invalidVersion
    }
    
    guard !script.name.isEmpty else {
        throw ScriptError.emptyName
    }
    
    guard !script.actions.isEmpty else {
        throw ScriptError.emptyActions
    }
}
```

### 2. 数据完整性
```swift
// 动作验证
func validateAction(_ action: Action) throws {
    switch action.type {
    case "mouse":
        try validateMouseAction(action)
    case "keyboard":
        try validateKeyboardAction(action)
    case "image":
        try validateImageAction(action)
    default:
        throw ScriptError.invalidActionType
    }
}
```

## 📝 文档规范

### 1. 脚本注释
```json
{
  "version": "1.0",
  "name": "My Recorded Script",
  "createdAt": "2025-05-02T14:35:21Z",
  "description": "登录流程自动化脚本",
  "author": "User Name",
  "actions": []
}
```

### 2. 版本控制
```json
{
  "version": "1.0",
  "name": "My Recorded Script",
  "createdAt": "2025-05-02T14:35:21Z",
  "lastModified": "2025-05-02T15:30:00Z",
  "modifiedBy": "User Name",
  "actions": []
}
```

## 🔄 更新日志

### v1.0.0
- 初始数据格式
- 定义基础结构
- 添加动作类型
- 实现数据验证

### v1.1.0
- 添加图像识别
- 支持组合键
- 增加数据验证
- 完善文档规范

## 🔗 交叉引用声明

- 本文档需与以下文档保持一致性与联动：
  - `CONTRIBUTING.md`：数据结构变更需同步更新测试与文档
  - `QA_AUTOCHECK.md`：自动验收规则需与数据格式联动
  - `.cursorrules`：AI 生成数据需符合本规范

- 变更本文件时，建议自动通知相关文档维护者/负责人。

## 🤖 自动化校验要求

- PR/CI 流程需自动校验：
  - 脚本导入/导出、数据完整性、兼容性测试与本规范一致
  - 所有数据结构变更需自动触发相关测试
  - 主要文档变更需自动生成变更日志并通知团队

# 數據結構規範

## 核心數據模型
1. 腳本模型
   ```json
   {
     "id": "string",
     "name": "string",
     "description": "string",
     "steps": [
       {
         "type": "string",
         "target": "string",
         "action": "string",
         "delay": "number"
       }
     ],
     "createdAt": "string",
     "updatedAt": "string"
   }
   ```

2. 識別配置
   ```json
   {
     "id": "string",
     "name": "string",
     "type": "string",
     "threshold": "number",
     "region": {
       "x": "number",
       "y": "number",
       "width": "number",
       "height": "number"
     },
     "createdAt": "string",
     "updatedAt": "string"
   }
   ```

3. 點擊配置
   ```json
   {
     "id": "string",
     "name": "string",
     "type": "string",
     "position": {
       "x": "number",
       "y": "number"
     },
     "delay": "number",
     "createdAt": "string",
     "updatedAt": "string"
   }
   ```

## 數據存儲
1. 本地存儲
   - 使用 UserDefaults
   - 使用文件系統
   - 使用數據庫
   - 使用緩存

2. 數據備份
   - 自動備份
   - 手動備份
   - 雲備份
   - 版本控制

3. 數據同步
   - 自動同步
   - 手動同步
   - 衝突處理
   - 版本管理

## 數據驗證
1. 格式驗證
   - JSON 格式
   - 數據類型
   - 必填字段
   - 字段長度

2. 業務驗證
   - 唯一性檢查
   - 關聯性檢查
   - 有效性檢查
   - 完整性檢查

3. 安全驗證
   - 權限檢查
   - 加密檢查
   - 完整性檢查
   - 訪問控制

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - 數據模型完整性檢查
  - 數據格式規範檢查
  - 數據驗證規則檢查
  - 文檔同步檢查
  - 主要文檔變更需自動生成變更日誌並通知團隊 