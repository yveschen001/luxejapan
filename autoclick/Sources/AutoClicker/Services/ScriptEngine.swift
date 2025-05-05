// ScriptEngine.swift
// 腳本引擎：負責腳本的驗證、執行和管理
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/STYLE_GUIDE.md 获取结构与命名规范

import Foundation

enum ScriptEngineError: Error {
    case emptyScript
    case invalidAction
    case executionFailed
}

@MainActor
class ScriptEngine {
    private let storageService: ScriptStorageService
    private let actionPlayer: ScriptActionPlayer
    private let logService: LogService

    init(storageService: ScriptStorageService = .shared,
         actionPlayer: ScriptActionPlayer = .shared,
         logService: LogService = .shared)
    {
        self.storageService = storageService
        self.actionPlayer = actionPlayer
        self.logService = logService
    }

    func validate(_ script: Script) throws {
        guard !script.actions.isEmpty else {
            throw ScriptEngineError.emptyScript
        }

        // 驗證每個動作
        for action in script.actions {
            switch action.type {
            case .click:
                // 檢查點擊座標是否有效
                if action.position.x < 0 || action.position.y < 0 {
                    throw ScriptEngineError.invalidAction
                }
            case .keyPress, .keyRelease:
                // 檢查鍵碼是否有效
                if action.keyCode == nil {
                    throw ScriptEngineError.invalidAction
                }
            case .delay:
                // 檢查延遲時間是否有效
                if action.delay < 0 {
                    throw ScriptEngineError.invalidAction
                }
            case .move:
                // 檢查移動座標是否有效
                if action.position.x < 0 || action.position.y < 0 {
                    throw ScriptEngineError.invalidAction
                }
            }
        }
    }

    func execute(_ script: Script, completion: @escaping (Bool) -> Void) {
        do {
            try validate(script)
            actionPlayer.play(script: script.actions) { [weak self] message in
                self?.logService.info(message)
            }
            completion(true)
        } catch {
            logService.error("腳本執行失敗：\(error)")
            completion(false)
        }
    }

    func stop() {
        actionPlayer.stop()
    }
}
