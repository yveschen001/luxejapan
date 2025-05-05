import AppKit
import Foundation

struct ImageTemplate: Identifiable, Codable {
    let id: UUID
    let imageId: String
    var name: String
    var image: NSImage
    var matchThreshold: Float
    var maxRetries: Int
    var interval: TimeInterval
    var region: CGRect?

    init(id: UUID = UUID(), imageId: String, name: String = "", image: NSImage = NSImage(), matchThreshold: Float = 0.85, maxRetries: Int = 3, interval: TimeInterval = 1.0, region: CGRect? = nil) {
        self.id = id
        self.imageId = imageId
        self.name = name
        self.image = image
        self.matchThreshold = matchThreshold
        self.maxRetries = maxRetries
        self.interval = interval
        self.region = region
    }

    enum CodingKeys: String, CodingKey {
        case id
        case imageId
        case name
        case matchThreshold
        case maxRetries
        case interval
        case region
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(UUID.self, forKey: .id)
        imageId = try container.decode(String.self, forKey: .imageId)
        name = try container.decode(String.self, forKey: .name)
        matchThreshold = try container.decode(Float.self, forKey: .matchThreshold)
        maxRetries = try container.decode(Int.self, forKey: .maxRetries)
        interval = try container.decode(TimeInterval.self, forKey: .interval)
        region = try container.decodeIfPresent(CGRect.self, forKey: .region)

        // 从文件加载图像
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        let imagePath = appSupport.appendingPathComponent("AutoClicker/Images/\(imageId).png")
        image = NSImage(contentsOf: imagePath) ?? NSImage()
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(imageId, forKey: .imageId)
        try container.encode(name, forKey: .name)
        try container.encode(matchThreshold, forKey: .matchThreshold)
        try container.encode(maxRetries, forKey: .maxRetries)
        try container.encode(interval, forKey: .interval)
        try container.encodeIfPresent(region, forKey: .region)
    }
}
