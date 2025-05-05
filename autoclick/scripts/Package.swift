// swift-tools-version: 6.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "autoclick",
    platforms: [
        .macOS(.v14),
    ],
    products: [
        .executable(
            name: "AutoClicker",
            targets: ["AutoClicker"]
        ),
    ],
    dependencies: [
        // 添加必要的依賴項
    ],
    targets: [
        .executableTarget(
            name: "AutoClicker",
            dependencies: [],
            path: "AutoClicker",
            exclude: [
                "Tests",
            ],
            resources: [
                .process("Assets.xcassets"),
                .process("Resources"),
                .process("README.md"),
            ]
        ),
        .testTarget(
            name: "AutoClickerTests",
            dependencies: ["AutoClicker"],
            path: "AutoClickerTests"
        ),
    ]
)
