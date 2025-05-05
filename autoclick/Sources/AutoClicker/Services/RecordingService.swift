import AppKit
import Combine
import Foundation

@MainActor
class RecordingService: ObservableObject {
    static let shared = RecordingService()

    @Published private(set) var isRecording = false
    @Published private(set) var currentScript: Script?

    private let logService = LogService.shared
    private let scriptManager = ScriptManager.shared
    private var eventMonitor: Any?
    private var mouseLocation: CGPoint?
    private var lastClickTime: Date?
    private var lastClickLocation: CGPoint?

    private init() {}

    func startRecording() async throws {
        guard !isRecording else {
            await logService.warning("錄製已在進行中")
            return
        }

        // 创建新脚本
        currentScript = Script(name: "新錄製腳本 \(Date())", actions: [])
        isRecording = true

        // 开始监听鼠标事件
        eventMonitor = NSEvent.addGlobalMonitorForEvents(matching: [.leftMouseDown, .rightMouseDown, .keyDown]) { [weak self] event in
            guard let self else { return }
            Task { @MainActor in
                await self.handleEvent(event)
            }
        }

        await logService.info("開始錄製：\(currentScript?.name ?? "")")
    }

    func stopRecording() async throws {
        guard isRecording else {
            await logService.warning("沒有正在進行的錄製")
            return
        }

        // 停止监听
        if let monitor = eventMonitor {
            NSEvent.removeMonitor(monitor)
            eventMonitor = nil
        }

        // 保存脚本
        if let script = currentScript {
            try await scriptManager.saveScript(script)
            await logService.info("保存腳本：\(script.name)")
        }

        isRecording = false
        currentScript = nil
        mouseLocation = nil
        lastClickTime = nil
        lastClickLocation = nil

        await logService.info("停止錄製")
    }

    private func handleEvent(_ event: NSEvent) async {
        guard isRecording, var script = currentScript else { return }

        switch event.type {
        case .leftMouseDown:
            let location = NSEvent.mouseLocation
            mouseLocation = location

            // 检查是否是双击
            if let lastTime = lastClickTime,
               let lastLocation = lastClickLocation,
               Date().timeIntervalSince(lastTime) < 0.5,
               abs(lastLocation.x - location.x) < 5,
               abs(lastLocation.y - location.y) < 5
            {
                // 移除上一个单击动作
                script.actions.removeLast()

                // 添加双击动作
                let action = ScriptAction(type: .doubleClick, point: location)
                script.actions.append(action)

                await logService.info("記錄雙擊：\(location)")

                // 重置双击检测
                lastClickTime = nil
                lastClickLocation = nil
            } else {
                // 记录单击
                let action = ScriptAction(type: .click, point: location)
                script.actions.append(action)

                await logService.info("記錄單擊：\(location)")

                // 更新双击检测
                lastClickTime = Date()
                lastClickLocation = location
            }

        case .rightMouseDown:
            let location = NSEvent.mouseLocation
            let action = ScriptAction(type: .rightClick, point: location)
            script.actions.append(action)

            await logService.info("記錄右鍵點擊：\(location)")

        case .keyDown:
            let action = ScriptAction(
                type: .keyPress,
                key: event.charactersIgnoringModifiers,
                modifiers: event.modifierFlags.rawValue
            )
            script.actions.append(action)

            await logService.info("記錄按鍵：\(event.charactersIgnoringModifiers ?? "") 修飾鍵：\(event.modifierFlags)")

        default:
            break
        }

        currentScript = script
    }

    func getCurrentScript() -> Script? {
        currentScript
    }

    func setCurrentScript(_ script: Script) {
        currentScript = script
    }

    func clearCurrentScript() {
        currentScript = nil
    }
}
