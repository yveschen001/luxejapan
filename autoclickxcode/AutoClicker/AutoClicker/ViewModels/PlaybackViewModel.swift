import SwiftUI

class PlaybackViewModel: ObservableObject {
    @Published var isPlaying = false
    @Published var isShortcutEnabled = false
    @Published var simulateError = false

    func startPlayback() {
        if simulateError {
            return
        }
        isPlaying = true
    }

    func stopPlayback() {
        isPlaying = false
    }

    func toggleShortcut() {
        isShortcutEnabled.toggle()
    }
}
