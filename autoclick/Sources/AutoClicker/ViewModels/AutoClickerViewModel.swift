import Combine
import Foundation
import SwiftUI

@MainActor
class AutoClickerViewModel: ObservableObject {
    @Published var isClicking = false
    @Published var clickInterval: Double = 1.0
    @Published var clickCount: Int = 0
    @Published var clickPosition: CGPoint = .zero
    
    private var timer: Timer?
    private let mouseService = MouseService()
    
    func startClicking() {
        guard !isClicking else { return }
        isClicking = true
        clickCount = 0
        
        timer = Timer.scheduledTimer(withTimeInterval: clickInterval, repeats: true) { [weak self] _ in
            self?.performClick()
        }
    }
    
    func stopClicking() {
        isClicking = false
        timer?.invalidate()
        timer = nil
    }
    
    func setClickPosition(_ position: CGPoint) {
        clickPosition = position
    }
    
    private func performClick() {
        mouseService.click(at: clickPosition)
        clickCount += 1
    }

    deinit {
        stopClicking()
    }
}
