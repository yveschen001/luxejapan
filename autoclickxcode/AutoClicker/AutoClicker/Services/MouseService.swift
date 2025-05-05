import CoreGraphics
import Foundation
import AppKit

@MainActor
class MouseService {
    static let shared = MouseService()
    private let logService = LogService.shared
    private var eventSource: CGEventSource?

    private init() {
        eventSource = CGEventSource(stateID: .hidSystemState)
    }

    func click(at position: CGPoint) {
        let source = CGEventSource(stateID: .hidSystemState)
        
        // 移動鼠標
        let moveEvent = CGEvent(mouseEventSource: source, mouseType: .mouseMoved, mouseCursorPosition: position, mouseButton: .left)
        moveEvent?.post(tap: .cghidEventTap)
        
        // 按下鼠標
        let downEvent = CGEvent(mouseEventSource: source, mouseType: .leftMouseDown, mouseCursorPosition: position, mouseButton: .left)
        downEvent?.post(tap: .cghidEventTap)
        
        // 釋放鼠標
        let upEvent = CGEvent(mouseEventSource: source, mouseType: .leftMouseUp, mouseCursorPosition: position, mouseButton: .left)
        upEvent?.post(tap: .cghidEventTap)
    }

    func doubleClick(at position: CGPoint) {
        click(at: position)
        usleep(100_000) // 100ms
        click(at: position)
    }

    func rightClick(at position: CGPoint) {
        guard let source = eventSource else { return }

        // 移動滑鼠到指定位置
        move(to: position)

        // 模擬右鍵點擊
        if let mouseDown = CGEvent(mouseEventSource: source, mouseType: .rightMouseDown,
                                 mouseCursorPosition: position, mouseButton: .right)
        {
            mouseDown.post(tap: .cghidEventTap)
        }

        // 短暫延遲
        usleep(100_000) // 100ms

        // 釋放滑鼠按鈕
        if let mouseUp = CGEvent(mouseEventSource: source, mouseType: .rightMouseUp,
                               mouseCursorPosition: position, mouseButton: .right)
        {
            mouseUp.post(tap: .cghidEventTap)
        }

        Task { @MainActor in
            await logService.info("右鍵點擊位置：\(position)")
        }
    }

    func move(to position: CGPoint) {
        guard let source = eventSource else { return }

        if let event = CGEvent(mouseEventSource: source, mouseType: .mouseMoved,
                             mouseCursorPosition: position, mouseButton: .left)
        {
            event.post(tap: .cghidEventTap)
        }

        // 等待滑鼠移動完成
        usleep(50_000) // 50ms

        Task { @MainActor in
            await logService.info("移動滑鼠到：\(position)")
        }
    }

    func drag(from start: CGPoint, to end: CGPoint, duration: TimeInterval) {
        guard let source = eventSource else { return }

        // 移動到起始位置
        move(to: start)

        // 按下滑鼠
        if let mouseDown = CGEvent(mouseEventSource: source, mouseType: .leftMouseDown,
                                 mouseCursorPosition: start, mouseButton: .left)
        {
            mouseDown.post(tap: .cghidEventTap)
        }

        // 計算移動步驟
        let steps = Int(duration * 60) // 60fps
        let dx = (end.x - start.x) / CGFloat(steps)
        let dy = (end.y - start.y) / CGFloat(steps)
        let stepDuration = UInt32(duration * 1_000_000 / Double(steps))

        // 逐步移動
        for i in 1...steps {
            let currentPoint = CGPoint(
                x: start.x + dx * CGFloat(i),
                y: start.y + dy * CGFloat(i)
            )
            
            if let dragEvent = CGEvent(mouseEventSource: source, mouseType: .leftMouseDragged,
                                     mouseCursorPosition: currentPoint, mouseButton: .left)
            {
                dragEvent.post(tap: .cghidEventTap)
            }
            
            usleep(stepDuration)
        }

        // 釋放滑鼠
        if let mouseUp = CGEvent(mouseEventSource: source, mouseType: .leftMouseUp,
                               mouseCursorPosition: end, mouseButton: .left)
        {
            mouseUp.post(tap: .cghidEventTap)
        }

        Task { @MainActor in
            await logService.info("拖拽從 \(start) 到 \(end)")
        }
    }

    // 获取当前鼠标位置
    func getCurrentPosition() -> CGPoint {
        let source = CGEventSource(stateID: .hidSystemState)
        let event = CGEvent(source: source)
        return event?.location ?? .zero
    }
}
