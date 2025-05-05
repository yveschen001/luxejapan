// Script.swift
// 腳本模型：定義腳本結構和動作類型
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/DATA_SCHEMA.md 获取数据结构规范

import CoreGraphics
import Foundation

/// 腳本動作類型
enum ScriptActionType: String, Codable {
    case click
    case move
    case keyPress
    case keyUp
    case wait
    case matchImage
}

/// 腳本動作
struct ScriptAction: Codable {
    let type: ScriptActionType
    let point: CGPoint?
    let key: String?
    let modifiers: UInt64?
    let duration: TimeInterval?
    let imageId: String?
    let matchThreshold: Double?
    let maxRetries: Int?
    let region: CGRect?

    init(
        type: ScriptActionType,
        point: CGPoint? = nil,
        key: String? = nil,
        modifiers: UInt64? = nil,
        duration: TimeInterval? = nil,
        imageId: String? = nil,
        matchThreshold: Double? = nil,
        maxRetries: Int? = nil,
        region: CGRect? = nil
    ) {
        self.type = type
        self.point = point
        self.key = key
        self.modifiers = modifiers
        self.duration = duration
        self.imageId = imageId
        self.matchThreshold = matchThreshold
        self.maxRetries = maxRetries
        self.region = region
    }
}

/// 腳本
struct Script: Codable, Identifiable {
    let id: UUID
    var name: String
    var actions: [ScriptAction]
    var repeatCount: Int
    var interval: TimeInterval
    var updatedAt: Date

    init(id: UUID = UUID(), 
         name: String, 
         actions: [ScriptAction] = [], 
         repeatCount: Int = 1, 
         interval: TimeInterval = 0.5,
         updatedAt: Date = Date()) {
        self.id = id
        self.name = name
        self.actions = actions
        self.repeatCount = repeatCount
        self.interval = interval
        self.updatedAt = updatedAt
    }

    func updateTimestamp() -> Script {
        var updatedScript = self
        updatedScript.updatedAt = Date()
        return updatedScript
    }
}
