import SwiftUI

class SettingsViewModel: ObservableObject {
    @Published var isAutoLaunchEnabled = false
    @Published var selectedLanguage = "en"
    @Published var shortcutKey = ""
    @Published var showLanguageRestartAlert = false
    @Published var shortcutSettings: [ShortcutSetting] = []

    let storagePath: String

    init() {
        storagePath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first?.path ?? ""
        loadSettings()
    }

    func loadSettings() {
        isAutoLaunchEnabled = UserDefaults.standard.bool(forKey: "autoLaunch")
        selectedLanguage = UserDefaults.standard.string(forKey: "selectedLanguage") ?? "en"
        shortcutKey = UserDefaults.standard.string(forKey: "shortcutKey") ?? ""
        shortcutSettings = [
            ShortcutSetting(title: "播放快捷鍵", key: "playShortcut", value: UserDefaults.standard.string(forKey: "playShortcut") ?? ""),
            ShortcutSetting(title: "停止快捷鍵", key: "stopShortcut", value: UserDefaults.standard.string(forKey: "stopShortcut") ?? ""),
        ]
    }

    func toggleAutoLaunch() {
        isAutoLaunchEnabled.toggle()
        UserDefaults.standard.set(isAutoLaunchEnabled, forKey: "autoLaunch")
    }

    func setLanguage(_ language: String) {
        selectedLanguage = language
        UserDefaults.standard.set(language, forKey: "selectedLanguage")
        showLanguageRestartAlert = true
    }

    func setShortcutKey(_ key: String) {
        shortcutKey = key
        UserDefaults.standard.set(key, forKey: "shortcutKey")
    }
}
