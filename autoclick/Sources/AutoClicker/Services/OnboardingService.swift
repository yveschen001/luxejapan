import Foundation
import SwiftUI

/// 引導服務
class OnboardingService: ObservableObject {
    /// 單例
    static let shared = OnboardingService()

    /// 引導步驟
    enum OnboardingStep: Int, CaseIterable {
        case welcome
        case permissions
        case recording
        case playback
        case shortcuts
        case imageRecognition
        case complete

        /// 步驟標題
        var title: String {
            switch self {
            case .welcome:
                "歡迎使用 AutoClicker"
            case .permissions:
                "權限設置"
            case .recording:
                "錄製功能"
            case .playback:
                "播放功能"
            case .shortcuts:
                "快捷鍵"
            case .imageRecognition:
                "圖像識別"
            case .complete:
                "設置完成"
            }
        }

        /// 步驟描述
        var description: String {
            switch self {
            case .welcome:
                "AutoClicker 是一個強大的自動化工具，可以幫助您錄製和重播鼠標操作。"
            case .permissions:
                "為了正常工作，我們需要以下權限：\n• 輔助功能權限\n• 屏幕錄製權限"
            case .recording:
                "使用錄製功能可以：\n• 記錄鼠標點擊\n• 保存等待時間\n• 添加條件判斷"
            case .playback:
                "播放功能支持：\n• 循環播放\n• 延遲控制\n• 條件觸發"
            case .shortcuts:
                "使用快捷鍵可以：\n• 快速開始/停止錄製\n• 控制播放\n• 自定義組合鍵"
            case .imageRecognition:
                "圖像識別功能：\n• 模板匹配\n• 顏色識別\n• 智能等待"
            case .complete:
                "恭喜！您已完成所有設置，現在可以開始使用了。"
            }
        }

        /// 步驟圖標
        var icon: String {
            switch self {
            case .welcome:
                "hand.wave.fill"
            case .permissions:
                "lock.shield.fill"
            case .recording:
                "record.circle.fill"
            case .playback:
                "play.circle.fill"
            case .shortcuts:
                "keyboard.fill"
            case .imageRecognition:
                "eye.fill"
            case .complete:
                "checkmark.circle.fill"
            }
        }
    }

    /// 快捷鍵教學
    struct ShortcutTutorial: Identifiable {
        let id = UUID()
        let key: String
        let description: String
        let example: String
    }

    /// 當前步驟
    @Published private(set) var currentStep: OnboardingStep = .welcome

    /// 是否已完成引導
    @Published private(set) var isCompleted: Bool = false

    /// 快捷鍵教學列表
    let shortcutTutorials: [ShortcutTutorial] = [
        ShortcutTutorial(
            key: "⌘ R",
            description: "開始/停止錄製",
            example: "按下 ⌘ R 開始錄製，再次按下停止"
        ),
        ShortcutTutorial(
            key: "⌘ P",
            description: "開始/停止播放",
            example: "按下 ⌘ P 開始播放，再次按下停止"
        ),
        ShortcutTutorial(
            key: "⌘ S",
            description: "保存腳本",
            example: "按下 ⌘ S 保存當前錄製的腳本"
        ),
        ShortcutTutorial(
            key: "⌘ O",
            description: "打開腳本",
            example: "按下 ⌘ O 打開已保存的腳本"
        ),
        ShortcutTutorial(
            key: "⌘ .",
            description: "停止所有操作",
            example: "在任何時候按下 ⌘ . 立即停止"
        ),
    ]

    /// 示例腳本
    let exampleScripts: [(name: String, description: String)] = [
        (
            "簡單點擊",
            "點擊指定位置 3 次"
        ),
        (
            "條件等待",
            "等待圖像出現後點擊"
        ),
        (
            "循環操作",
            "重複執行直到條件滿足"
        ),
        (
            "顏色識別",
            "識別指定顏色並點擊"
        ),
    ]

    /// 初始化
    private init() {
        loadProgress()
    }

    /// 下一步
    func nextStep() {
        guard let nextIndex = OnboardingStep.allCases.firstIndex(of: currentStep)?.advanced(by: 1),
              let nextStep = OnboardingStep(rawValue: nextIndex)
        else {
            completeOnboarding()
            return
        }

        currentStep = nextStep
        saveProgress()
    }

    /// 上一步
    func previousStep() {
        guard let previousIndex = OnboardingStep.allCases.firstIndex(of: currentStep)?.advanced(by: -1),
              let previousStep = OnboardingStep(rawValue: previousIndex)
        else {
            return
        }

        currentStep = previousStep
        saveProgress()
    }

    /// 完成引導
    private func completeOnboarding() {
        isCompleted = true
        UserDefaults.standard.set(true, forKey: "OnboardingCompleted")
        saveProgress()
    }

    /// 重置引導
    func resetOnboarding() {
        currentStep = .welcome
        isCompleted = false
        UserDefaults.standard.set(false, forKey: "OnboardingCompleted")
        saveProgress()
    }

    /// 保存進度
    private func saveProgress() {
        UserDefaults.standard.set(currentStep.rawValue, forKey: "OnboardingStep")
    }

    /// 加載進度
    private func loadProgress() {
        isCompleted = UserDefaults.standard.bool(forKey: "OnboardingCompleted")
        if let stepValue = UserDefaults.standard.object(forKey: "OnboardingStep") as? Int,
           let step = OnboardingStep(rawValue: stepValue)
        {
            currentStep = step
        }
    }

    /// 獲取示例腳本內容
    func getExampleScriptContent(name: String) -> String {
        switch name {
        case "簡單點擊":
            """
            {
                "name": "簡單點擊",
                "actions": [
                    {
                        "type": "click",
                        "x": 100,
                        "y": 100,
                        "repeat": 3,
                        "interval": 1.0
                    }
                ]
            }
            """
        case "條件等待":
            """
            {
                "name": "條件等待",
                "actions": [
                    {
                        "type": "wait_image",
                        "image": "target.png",
                        "timeout": 10.0
                    },
                    {
                        "type": "click",
                        "x": "$image_x",
                        "y": "$image_y"
                    }
                ]
            }
            """
        case "循環操作":
            """
            {
                "name": "循環操作",
                "actions": [
                    {
                        "type": "loop",
                        "condition": {
                            "type": "image_exists",
                            "image": "stop.png"
                        },
                        "actions": [
                            {
                                "type": "click",
                                "x": 200,
                                "y": 200
                            },
                            {
                                "type": "wait",
                                "duration": 2.0
                            }
                        ]
                    }
                ]
            }
            """
        case "顏色識別":
            """
            {
                "name": "顏色識別",
                "actions": [
                    {
                        "type": "find_color",
                        "color": "#FF0000",
                        "tolerance": 0.1
                    },
                    {
                        "type": "click",
                        "x": "$color_x",
                        "y": "$color_y"
                    }
                ]
            }
            """
        default:
            ""
        }
    }
}

// MARK: - 引導視圖

struct OnboardingView: View {
    @StateObject private var onboarding = OnboardingService.shared
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // 頂部進度指示器
                ProgressView(
                    value: Double(onboarding.currentStep.rawValue),
                    total: Double(OnboardingService.OnboardingStep.allCases.count - 1)
                )
                .padding()

                // 步驟圖標
                Image(systemName: onboarding.currentStep.icon)
                    .font(.system(size: 60))
                    .foregroundColor(.accentColor)

                // 步驟標題
                Text(onboarding.currentStep.title)
                    .font(.title)
                    .bold()

                // 步驟描述
                Text(onboarding.currentStep.description)
                    .multilineTextAlignment(.center)
                    .padding()

                // 步驟特定內容
                stepContent

                Spacer()

                // 導航按鈕
                HStack {
                    if onboarding.currentStep != .welcome {
                        Button("上一步") {
                            onboarding.previousStep()
                        }
                    }

                    Spacer()

                    Button(onboarding.currentStep == .complete ? "完成" : "下一步") {
                        if onboarding.currentStep == .complete {
                            dismiss()
                        } else {
                            onboarding.nextStep()
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding()
            }
            .padding()
            .navigationBarHidden(true)
        }
    }

    /// 步驟特定內容
    @ViewBuilder
    private var stepContent: some View {
        switch onboarding.currentStep {
        case .shortcuts:
            shortcutTutorialView
        case .complete:
            exampleScriptsView
        default:
            EmptyView()
        }
    }

    /// 快捷鍵教學視圖
    private var shortcutTutorialView: some View {
        ScrollView {
            VStack(spacing: 15) {
                ForEach(onboarding.shortcutTutorials) { tutorial in
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Text(tutorial.key)
                                .font(.system(.body, design: .monospaced))
                                .padding(5)
                                .background(Color.secondary.opacity(0.2))
                                .cornerRadius(5)

                            Text(tutorial.description)
                                .font(.headline)
                        }

                        Text(tutorial.example)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color.secondary.opacity(0.1))
                    .cornerRadius(10)
                }
            }
            .padding()
        }
    }

    /// 示例腳本視圖
    private var exampleScriptsView: some View {
        ScrollView {
            VStack(spacing: 15) {
                ForEach(onboarding.exampleScripts, id: \.name) { script in
                    VStack(alignment: .leading, spacing: 5) {
                        Text(script.name)
                            .font(.headline)

                        Text(script.description)
                            .font(.subheadline)
                            .foregroundColor(.secondary)

                        Text(onboarding.getExampleScriptContent(name: script.name))
                            .font(.system(.caption, design: .monospaced))
                            .padding(5)
                            .background(Color.secondary.opacity(0.2))
                            .cornerRadius(5)
                    }
                    .padding()
                    .background(Color.secondary.opacity(0.1))
                    .cornerRadius(10)
                }
            }
            .padding()
        }
    }
}
