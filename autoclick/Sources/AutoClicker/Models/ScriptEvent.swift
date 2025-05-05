import Foundation

struct ScriptEvent: Codable, Identifiable {
    let id: UUID
    let type: EventType
    let delay: TimeInterval
    let position: CGPoint?
    let keyCode: UInt16?
    let timestamp: Date

    init(id: UUID = UUID(), type: EventType, delay: TimeInterval = 0, position: CGPoint? = nil, keyCode: UInt16? = nil) {
        self.id = id
        self.type = type
        self.delay = delay
        self.position = position
        self.keyCode = keyCode
        timestamp = Date()
    }
}

enum EventType: String, Codable {
    case click
    case keyPress
    case delay
}
