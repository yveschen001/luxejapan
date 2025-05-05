// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "AutoClicker",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(name: "AutoClicker", targets: ["AutoClicker"])
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-argument-parser", from: "1.2.0"),
        .package(url: "https://github.com/apple/swift-log", from: "1.5.0")
    ],
    targets: [
        .executableTarget(
            name: "AutoClicker",
            dependencies: [
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
                .product(name: "Logging", package: "swift-log")
            ],
            exclude: [
                "Assets.xcassets",
                "Info.plist",
                "README.md",
                "Resources/Localizable.strings"
            ]
        )
    ]
)
