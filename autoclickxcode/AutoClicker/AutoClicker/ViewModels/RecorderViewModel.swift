// RecorderViewModel.swift
// 錄製事件 ViewModel：負責錄製滑鼠與鍵盤事件，封裝為 ScriptAction，並即時更新 UI
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 STYLE_GUIDE.md、DATA_SCHEMA.md 获取结构与命名规范
// 防呆：禁止於 class/struct/extension 上加 @MainActor，否則 C function pointer callback 編譯會失敗，僅允許標註於需要主執行緒的 instance method

import AppKit
import Combine
import CoreGraphics
import CoreServices
import Foundation
import SwiftUI

// MARK: - CGEventTap Callback（全局函數，徹底解決 C function pointer 編譯錯誤）

@MainActor
func recorderEventTapCallback(
    proxy _: CGEventTapProxy,
    type: CGEventType,
    event: CGEvent,
    refcon: UnsafeMutableRawPointer?
) -> Unmanaged<CGEvent>? {
    guard let refcon else { return Unmanaged.passUnretained(event) }
    let recorder = Unmanaged<RecorderViewModel>.fromOpaque(refcon).takeUnretainedValue()
    guard recorder.isRecording else { return Unmanaged.passUnretained(event) }
    let now = Date().timeIntervalSince1970
    let delay = (recorder.lastEventTimestamp != nil) ? now - recorder.lastEventTimestamp! : 0
    recorder.lastEventTimestamp = now
    var actionType: ScriptActionType?
    let position: CGPoint = event.location

    switch type {
    case .leftMouseDown:
        actionType = .click
    case .keyDown:
        actionType = .keyPress
    case .keyUp:
        actionType = .keyRelease
    default:
        break
    }

    if let actionType {
        let action = ScriptAction(
            type: actionType,
            position: position,
            keyCode: Int(event.getIntegerValueField(.keyboardEventKeycode)),
            delay: delay
        )
        recorder.recordAction(action)
    }

    return Unmanaged.passUnretained(event)
}

@MainActor
class RecorderViewModel: ObservableObject {
    // MARK: - Properties

    @Published var isRecording = false
    @Published var logMessages: [String] = []
    
    private let recordingService: RecordingService
    private let logService: LogService
    private var recordedActions: [ScriptAction] = []
    private var lastEventTimestamp: TimeInterval = 0
    
    init(recordingService: RecordingService, logService: LogService) {
        self.recordingService = recordingService
        self.logService = logService
    }
    
    func startRecording() {
        isRecording = true
        recordedActions.removeAll()
        lastEventTimestamp = Date().timeIntervalSince1970
        Task { @MainActor in
            logService.info("開始錄製")
            logMessages.append("開始錄製")
        }
    }
    
    func stopRecording() -> Script {
        isRecording = false
        let script = Script(actions: recordedActions)
        Task { @MainActor in
            logService.info("停止錄製")
            logMessages.append("停止錄製")
        }
        return script
    }
    
    func handleMouseEvent(eventType: CGEventType, position: CGPoint) {
        guard isRecording else { return }
        
        let currentTime = Date().timeIntervalSince1970
        let delay = currentTime - lastEventTimestamp
        lastEventTimestamp = currentTime
        
        var actionType: ScriptActionType?
        
        switch eventType {
        case .leftMouseDown:
            actionType = .click
        case .mouseMoved:
            actionType = .move
        default:
            break
        }
        
        if let actionType {
            let action = ScriptAction(
                type: actionType,
                point: position,
                duration: delay
            )
            recordAction(action)
        }
    }
    
    func handleKeyEvent(eventType: CGEventType, keyCode: Int) {
        guard isRecording else { return }
        
        let currentTime = Date().timeIntervalSince1970
        let delay = currentTime - lastEventTimestamp
        lastEventTimestamp = currentTime
        
        var actionType: ScriptActionType?
        
        switch eventType {
        case .keyDown:
            actionType = .keyPress
        case .keyUp:
            actionType = .keyUp
        default:
            break
        }
        
        if let actionType {
            let action = ScriptAction(
                type: actionType,
                key: String(keyCode),
                duration: delay
            )
            recordAction(action)
        }
    }
    
    private func recordAction(_ action: ScriptAction) {
        recordedActions.append(action)
        DispatchQueue.main.async {
            self.logMessages.append("記錄動作：\(action.type)")
        }
    }
}

extension RecorderViewModel {
    static var mock: RecorderViewModel {
        let vm = RecorderViewModel(recordingService: RecordingService.shared, logService: LogService.shared)
        // 可填入假資料
        return vm
    }
}
