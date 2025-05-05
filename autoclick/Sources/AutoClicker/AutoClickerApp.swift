import SwiftUI

@main
struct AutoClickerApp: App {
    var body: some Scene {
        WindowGroup {
            AutoClickerView()
        }
        .windowStyle(.hiddenTitleBar)
        .windowResizability(.contentSize)
    }
} 