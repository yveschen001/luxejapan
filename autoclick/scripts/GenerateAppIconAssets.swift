// GenerateAppIconAssets.swift
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/STYLE_GUIDE.md 获取结构与命名规范

import Foundation

// MARK: - AppIcon Generator

struct AppIconGenerator {
    // MARK: - Properties

    private let basePath = "AutoClicker/Assets.xcassets/AppIcon.appiconset"
    private let iconSizes = [
        (size: "16x16", scale: "1x", filename: "icon16.png"),
        (size: "16x16", scale: "2x", filename: "icon16@2x.png"),
        (size: "32x32", scale: "1x", filename: "icon32.png"),
        (size: "32x32", scale: "2x", filename: "icon32@2x.png"),
        (size: "64x64", scale: "1x", filename: "icon64.png"),
        (size: "64x64", scale: "2x", filename: "icon64@2x.png"),
        (size: "128x128", scale: "1x", filename: "icon128.png"),
        (size: "128x128", scale: "2x", filename: "icon128@2x.png"),
        (size: "256x256", scale: "1x", filename: "icon256.png"),
        (size: "256x256", scale: "2x", filename: "icon256@2x.png"),
        (size: "512x512", scale: "1x", filename: "icon512.png"),
        (size: "512x512", scale: "2x", filename: "icon512@2x.png"),
        (size: "1024x1024", scale: "1x", filename: "icon1024.png"),
    ]

    // MARK: - Public Methods

    func generate() throws {
        // 1. 建立目錄
        try createDirectory()

        // 2. 生成 Contents.json
        try generateContentsJSON()

        // 3. 生成 placeholder 圖標
        try generatePlaceholderIcon()

        print("✅ AppIcon 資源生成完成！")
        print("📁 路徑：\(basePath)")
        print("📌 請將 1024x1024 的圖標替換為正式圖標")
    }

    // MARK: - Private Methods

    private func createDirectory() throws {
        let fileManager = FileManager.default
        try fileManager.createDirectory(atPath: basePath, withIntermediateDirectories: true)
    }

    private func generateContentsJSON() throws {
        let contents: [String: Any] = [
            "images": iconSizes.map { size in
                [
                    "idiom": "mac",
                    "size": size.size,
                    "scale": size.scale,
                    "filename": size.filename,
                ]
            },
            "info": [
                "version": 1,
                "author": "xcode",
            ],
        ]

        let jsonData = try JSONSerialization.data(withJSONObject: contents, options: .prettyPrinted)
        let jsonString = String(data: jsonData, encoding: .utf8)!

        try jsonString.write(toFile: "\(basePath)/Contents.json", atomically: true, encoding: .utf8)
    }

    private func generatePlaceholderIcon() throws {
        // 這裡可以添加生成 placeholder 圖標的代碼
        // 目前使用空的 PNG 文件作為佔位符
        let placeholderData = Data()
        try placeholderData.write(to: URL(fileURLWithPath: "\(basePath)/icon1024.png"))
    }
}

// MARK: - Usage

do {
    let generator = AppIconGenerator()
    try generator.generate()
} catch {
    print("❌ 生成 AppIcon 資源時發生錯誤：\(error)")
}
