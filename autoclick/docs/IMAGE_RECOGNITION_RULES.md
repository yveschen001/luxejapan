# AutoClicker for macOS - 图像识别技术规则

> 📁 本文件遵循 docs/ENVIRONMENT_CONFIG.md 中的规范
> 📅 最後修改時間：2025-05-04 00:06

<!-- DO NOT MODIFY: This file defines critical rules for AI behavior, project architecture, and acceptance testing. -->

## 🎯 技术目标

### 1. 识别要求
- 稳定识别画面元素
- 准确执行点击操作
- 支持游戏场景
- 支持 UI 自动化
- 支持多显示器

### 2. 性能要求
- 识别延迟 < 100ms
- 内存占用 < 50MB
- CPU 使用率 < 20%
- 支持高帧率

## 🔍 技术选型

### 1. 核心框架
| 技术 | 适用场景 | 特点 |
|------|----------|------|
| Vision | macOS 原生 | 支持模板匹配、图像分类 |
| OpenCV | 高级处理 | 支持多种算法、变形补偿 |

### 2. 实现方案
```swift
// 屏幕截图（macOS 14.0+，需 async/await）
@available(macOS 14.0, *)
func captureScreen() async throws -> CGImage? {
    return try await ModernScreenCaptureService.shared.captureMainDisplayImage()
}

// 模板匹配
func matchTemplate(image: CGImage, template: CGImage) -> [CGPoint] {
    let request = VNTemplateMatchingRequest()
    let handler = VNImageRequestHandler(cgImage: image)
    try? handler.perform([request])
    return request.results?.map { $0.location } ?? []
}
```

## 🖼️ 图像管理

### 1. 存储规范
```swift
// 图像存储路径
let imagePath = "~/Library/Application Support/AutoClicker/images/"
let templatePath = "\(imagePath)/\(imageId).png"

// 图像压缩
func compressImage(_ image: NSImage) -> Data? {
    return image.tiffRepresentation?.compressed(using: .jpeg, factor: 0.8)
}
```

### 2. 图像要求
- 分辨率：≤ 300x300px
- 格式：PNG/JPG
- 质量：≥ 80%
- 特征：独特、稳定、高对比

## 🎯 识别参数

### 1. 基础参数
```swift
struct RecognitionParams {
    let imageId: String
    let matchThreshold: Float
    let interval: Int
    let maxRetries: Int
    let retryDelay: Int
    let clickMode: ClickMode
    let scanRegion: CGRect?
}
```

### 2. 参数说明
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| imageId | String | - | 模板图像ID |
| matchThreshold | Float | 0.85 | 匹配阈值 |
| interval | Int | 500 | 扫描间隔(ms) |
| maxRetries | Int | ∞ | 最大重试次数 |
| retryDelay | Int | =interval | 重试延迟(ms) |
| clickMode | String | clickCenter | 点击模式 |
| scanRegion | CGRect | nil | 扫描区域 |

## 🔄 执行流程

### 1. 识别流程
```swift
func recognizeAndClick(params: RecognitionParams) {
    for _ in 0..<params.maxRetries {
        guard let screen = try await captureScreen() else { continue }
        guard let template = loadTemplate(params.imageId) else { continue }
        
        let matches = matchTemplate(image: screen, template: template)
        if let bestMatch = matches.max(by: { $0.confidence < $1.confidence }) {
            if bestMatch.confidence >= params.matchThreshold {
                click(at: bestMatch.location, mode: params.clickMode)
                return
            }
        }
        
        Thread.sleep(forTimeInterval: Double(params.retryDelay) / 1000)
    }
    
    handleRecognitionFailure()
}
```

### 2. 错误处理
```swift
func handleRecognitionFailure() {
    LogManager.shared.error("Recognition failed")
    AlertManager.showError("无法识别目标图像")
}
```

## 🧠 容错机制

### 1. 分辨率适配
```swift
func adaptToResolution(_ image: CGImage) -> CGImage {
    let scale = NSScreen.main?.backingScaleFactor ?? 1.0
    return image.scaled(by: scale)
}
```

### 2. 多重匹配
```swift
func handleMultipleMatches(_ matches: [MatchResult]) {
    let bestMatch = matches.max(by: { $0.confidence < $1.confidence })
    LogManager.shared.info("Found \(matches.count) matches")
    return bestMatch
}
```

## 💬 日志与调试

### 1. 日志记录
```swift
func logRecognitionResult(_ result: RecognitionResult) {
    LogManager.shared.info("""
        Recognition Result:
        - Image: \(result.imageId)
        - Confidence: \(result.confidence)
        - Position: \(result.position)
        - Time: \(result.timestamp)
        """)
}
```

### 2. 调试工具
```swift
func debugRecognition() {
    let debugView = DebugView()
    debugView.showMatches(matches)
    debugView.showTemplate(template)
    debugView.showConfidence(confidence)
}
```

## 📊 性能监控

### 1. 监控指标
- 识别延迟
- 内存占用
- CPU 使用率
- 识别准确率
- 重试次数

### 2. 优化建议
- 使用缓存机制
- 优化图像处理
- 减少内存拷贝
- 使用异步处理

## 🔄 更新日志

### v1.0.0
- 初始识别功能
- 实现模板匹配
- 添加错误处理
- 完成日志系统

### v1.1.0
- 优化识别性能
- 增加容错机制
- 完善调试工具
- 提升稳定性 

## 識別算法
1. 模板匹配
   - 使用 OpenCV 模板匹配
   - 支持多種匹配方法
   - 支持相似度閾值
   - 支持多點匹配

2. 特徵匹配
   - 使用 SIFT/SURF 特徵
   - 支持旋轉不變性
   - 支持尺度不變性
   - 支持部分遮擋

3. 深度學習
   - 使用 CoreML 框架
   - 支持目標檢測
   - 支持圖像分類
   - 支持語義分割

## 識別配置
1. 基本參數
   - 相似度閾值：0.8-1.0
   - 最大匹配數：1-10
   - 搜索範圍：全屏/區域
   - 超時時間：1-60s

2. 高級參數
   - 圖像預處理
   - 降噪處理
   - 邊緣增強
   - 色彩空間轉換

3. 優化參數
   - GPU 加速
   - 多線程處理
   - 內存優化
   - 緩存策略

## 錯誤處理
1. 識別錯誤
   - 相似度過低
   - 目標不存在
   - 多目標衝突
   - 識別超時

2. 系統錯誤
   - 內存不足
   - GPU 錯誤
   - 權限錯誤
   - 驅動錯誤

3. 異常恢復
   - 自動重試
   - 降級處理
   - 錯誤報告
   - 日誌記錄

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - 識別準確率測試
  - 性能基準測試
  - 錯誤處理測試
  - 內存泄漏檢查
  - 主要文檔變更需自動生成變更日誌並通知團隊 

## 識別類型
1. 模板匹配
   - 精確匹配
   - 模糊匹配
   - 多模板匹配
   - 動態模板匹配

2. 特徵識別
   - 邊緣檢測
   - 角點檢測
   - 紋理分析
   - 形狀識別

3. 文字識別
   - 英文識別
   - 中文識別
   - 數字識別
   - 符號識別

## 識別參數
1. 匹配閾值
   - 精確度：0.9-1.0
   - 容錯度：0.1-0.3
   - 相似度：0.7-0.9
   - 置信度：0.8-1.0

2. 搜索範圍
   - 全屏搜索
   - 區域搜索
   - 窗口搜索
   - 自定義搜索

3. 識別速度
   - 實時識別：< 100ms
   - 快速識別：< 200ms
   - 精確識別：< 500ms
   - 批量識別：< 1000ms

## 優化策略
1. 性能優化
   - 圖像預處理
   - 搜索優化
   - 並行處理
   - 緩存機制

2. 準確度優化
   - 多特徵融合
   - 動態閾值
   - 上下文分析
   - 反饋學習

3. 穩定性優化
   - 錯誤處理
   - 超時處理
   - 重試機制
   - 日誌記錄

## 自動化校驗要求
- PR/CI 流程需自動校驗：
  - 識別準確率檢查
  - 識別速度檢查
  - 穩定性檢查
  - 主要文檔變更需自動生成變更日誌並通知團隊 