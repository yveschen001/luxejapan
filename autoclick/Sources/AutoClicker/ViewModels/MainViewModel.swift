import Combine
import Foundation
import SwiftUI

@MainActor
class MainViewModel: ObservableObject {
    // MARK: - Properties

    @Published private(set) var scripts: [Script] = []
    @Published private(set) var selectedScript: Script?
    @Published private(set) var isRecording = false
    @Published private(set) var isPlaying = false
    @Published var showError = false
    @Published private(set) var errorMessage: String?
    @Published private(set) var showSettings = false

    private let recordingService: RecordingService
    private let playbackService: PlaybackService
    private let scriptManager: ScriptManager
    private let logService: LogService
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Initialization

    init() {
        recordingService = RecordingService.shared
        playbackService = PlaybackService.shared
        scriptManager = ScriptManager.shared
        logService = LogService.shared
        Task {
            await loadScripts()
        }

        // 监听录制状态
        recordingService.$isRecording
            .receive(on: DispatchQueue.main)
            .assign(to: &$isRecording)

        // 监听播放状态
        playbackService.$isPlaying
            .receive(on: DispatchQueue.main)
            .assign(to: &$isPlaying)
    }

    // MARK: - Script Management

    func loadScripts() async {
        do {
            scripts = try await scriptManager.loadAllScripts()
            Task { @MainActor in
                await logService.info("加載了 \(scripts.count) 個腳本")
            }
        } catch {
            handleError(error)
        }
    }

    func selectScript(_ script: Script) {
        selectedScript = script
        Task { @MainActor in
            await logService.info("選擇了腳本：\(script.name)")
        }
    }

    func deleteScript(_ script: Script) async {
        do {
            try await scriptManager.deleteScript(id: script.id)
            if let index = scripts.firstIndex(where: { $0.id == script.id }) {
                scripts.remove(at: index)
            }
            if selectedScript?.id == script.id {
                selectedScript = nil
            }
            await loadScripts()
            Task { @MainActor in
                await logService.info("刪除了腳本：\(script.name)")
            }
        } catch {
            handleError(error)
        }
    }

    func renameScript(_ script: Script, to newName: String) async {
        do {
            try await scriptManager.renameScript(id: script.id, newName: newName)
            if let index = scripts.firstIndex(where: { $0.id == script.id }) {
                scripts[index].name = newName
            }
            if selectedScript?.id == script.id {
                selectedScript?.name = newName
            }
            Task { @MainActor in
                await logService.info("重命名腳本：\(script.name) -> \(newName)")
            }
        } catch {
            handleError(error)
        }
    }

    // MARK: - Recording Control

    func startRecording() async {
        guard !isRecording else {
            showWarning("錄製已在進行中")
            return
        }

        do {
            try await recordingService.startRecording()
        } catch {
            handleError(error)
        }
    }

    func stopRecording() async {
        guard isRecording else {
            showWarning("沒有正在進行的錄製")
            return
        }

        do {
            try await recordingService.stopRecording()
            if let script = recordingService.getCurrentScript() {
                try await scriptManager.saveScript(script)
                scripts.append(script)
                Task { @MainActor in
                    await logService.info("保存了新腳本：\(script.name)")
                }
            }
        } catch {
            handleError(error)
        }
    }

    // MARK: - Playback Control

    func startPlayback() async {
        guard !isPlaying else {
            showWarning("播放已在進行中")
            return
        }

        guard let script = selectedScript else {
            showWarning("請先選擇要播放的腳本")
            return
        }

        do {
            try await playbackService.startPlaying(script)
            Task { @MainActor in
                await logService.info("開始播放腳本：\(script.name)")
            }
        } catch {
            handleError(error)
        }
    }

    func stopPlayback() async {
        guard isPlaying else {
            showWarning("沒有正在進行的播放")
            return
        }

        do {
            try await playbackService.stopPlaying()
            Task { @MainActor in
                await logService.info("停止播放")
            }
        } catch {
            handleError(error)
        }
    }

    // MARK: - Error Handling

    private func handleError(_ error: Error) {
        errorMessage = error.localizedDescription
        showError = true
        Task { @MainActor in
            await logService.error("發生錯誤：\(error.localizedDescription)")
        }
    }

    private func showWarning(_ message: String) {
        errorMessage = message
        showError = true
        Task { @MainActor in
            await logService.warning(message)
        }
    }

    func startPlaying() {
        Task {
            do {
                try await playbackService.startPlaying()
            } catch {
                handleError(error)
            }
        }
    }

    func stop() {
        Task {
            do {
                if isRecording {
                    try await recordingService.stopRecording()
                } else if isPlaying {
                    try await playbackService.stopPlaying()
                }
            } catch {
                handleError(error)
            }
        }
    }

    func editScript(_ script: Script) {
        selectedScript = script
        Task { @MainActor in
            await logService.info("開始編輯腳本：\(script.name)")
        }
    }

    func clearError() {
        errorMessage = nil
        showError = false
    }
}
