import SwiftUI

struct ShortcutSetting: Identifiable, Equatable {
    let id = UUID()
    let title: String
    let key: String
    var value: String

    static func == (lhs: ShortcutSetting, rhs: ShortcutSetting) -> Bool {
        lhs.id == rhs.id
    }
}
