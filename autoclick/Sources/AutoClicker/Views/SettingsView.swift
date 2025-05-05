// SettingsView.swift
// 使用者設定介面，分區顯示快捷鍵、多語言、儲存路徑、自動啟動
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 STYLE_GUIDE.md、UI_GUIDELINES.md、SHORTCUTS.md 获取结构与命名规范

import ServiceManagement
import SwiftUI

protocol AppServiceProtocol {
    associatedtype Service
    static var mainApp: Service { get }
}

extension SMAppService: AppServiceProtocol {
    typealias Service = SMAppService
    static var mainApp: SMAppService {
        .mainApp
    }
}

struct SettingsView: View {
    @StateObject private var viewModel = SettingsViewModel()

    var body: some View {
        Form {
            Section(header: Text("基本設置")) {
                Toggle("開機自動啟動", isOn: $viewModel.isAutoLaunchEnabled)
                    .accessibilityIdentifier("auto-launch-toggle")
                    .onChange(of: viewModel.isAutoLaunchEnabled) { oldValue, newValue in
                        viewModel.toggleAutoLaunch()
                    }

                Picker("語言", selection: $viewModel.selectedLanguage) {
                    Text("English").tag("en")
                    Text("中文").tag("zh-Hans")
                }
                .accessibilityIdentifier("language-picker")
                .onChange(of: viewModel.selectedLanguage) { oldValue, newValue in
                    viewModel.setLanguage(newValue)
                }
            }

            Section(header: Text("快捷鍵設置")) {
                VStack(alignment: .leading) {
                    TextField("快捷鍵", text: $viewModel.shortcutKey)
                        .accessibilityIdentifier("shortcut-input")
                        .onChange(of: viewModel.shortcutKey) { oldValue, newValue in
                            viewModel.setShortcutKey(newValue)
                        }

                    HStack {
                        Text("播放快捷鍵")
                            .accessibilityIdentifier("play-shortcut")
                        Spacer()
                        Text("停止快捷鍵")
                            .accessibilityIdentifier("stop-shortcut")
                    }
                }
                .accessibilityIdentifier("shortcut-settings")
            }
        }
        .navigationTitle(Text("settings"))
        .formStyle(.grouped)
        .padding()
        .alert(isPresented: $viewModel.showLanguageRestartAlert) {
            Alert(title: Text("language_restart_title"), message: Text("language_restart_message"), dismissButton: .default(Text("ok")))
        }
    }

    init(viewModel: SettingsViewModel? = nil) {
        if let vm = viewModel {
            _viewModel = StateObject(wrappedValue: vm)
        }
    }

    @State private var shortcutError: String?

    private func openStoragePath() {
        let url = URL(fileURLWithPath: viewModel.storagePath)
        NSWorkspace.shared.open(url)
    }

    private func isConflict(_ setting: ShortcutSetting) -> Bool {
        let values = viewModel.shortcutSettings.map { $0.value.trimmingCharacters(in: .whitespaces) }
        let duplicates = values.filter { $0 == setting.value.trimmingCharacters(in: .whitespaces) }
        return duplicates.count > 1 && !setting.value.isEmpty
    }

    private func checkShortcutConflicts() {
        let values = viewModel.shortcutSettings.map { $0.value.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }
        let unique = Set(values)
        if unique.count != values.count {
            shortcutError = "shortcut_conflict_error"
        } else if values.contains("") {
            shortcutError = "shortcut_empty_error"
        } else {
            shortcutError = nil
        }
    }
}

// MARK: - 預覽

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .preferredColorScheme(.light)
        SettingsView()
            .preferredColorScheme(.dark)
    }
}
