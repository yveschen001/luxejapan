import CoreGraphics
import Foundation

class ClickService {
    private var isRunning = false
    private var timer: Timer?

    // 执行点击的间隔时间(秒)
    private var interval: TimeInterval = 1.0
    // 点击位置
    private var clickPosition: CGPoint?

    // 开始自动点击
    func startClicking(at position: CGPoint, interval: TimeInterval) {
        guard !isRunning else { return }

        clickPosition = position
        self.interval = interval
        isRunning = true

        timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { [weak self] _ in
            self?.performClick()
        }
    }

    // 停止自动点击
    func stopClicking() {
        timer?.invalidate()
        timer = nil
        isRunning = false
    }

    // 执行点击操作
    private func performClick() {
        guard let position = clickPosition else { return }

        let clickDown = CGEvent(mouseEventSource: nil, mouseType: .leftMouseDown,
                                mouseCursorPosition: position, mouseButton: .left)
        let clickUp = CGEvent(mouseEventSource: nil, mouseType: .leftMouseUp,
                              mouseCursorPosition: position, mouseButton: .left)

        clickDown?.post(tap: .cghidEventTap)
        clickUp?.post(tap: .cghidEventTap)
    }

    // 获取当前鼠标位置
    func getCurrentMousePosition() -> CGPoint {
        let mouseLocation = NSEvent.mouseLocation
        let screenFrame = NSScreen.main?.frame ?? .zero

        return CGPoint(x: mouseLocation.x,
                       y: screenFrame.height - mouseLocation.y)
    }
}
