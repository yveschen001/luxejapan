@testable import AutoClicker
import XCTest

final class ModuleManagerTests: XCTestCase {
    var moduleManager: SmartModuleManager!
    var testModule: SmartModule!

    override func setUp() {
        super.setUp()
        moduleManager = SmartModuleManager()
        testModule = SmartModule(name: "TestModule", version: "1.0.0")
    }

    override func tearDown() {
        moduleManager = nil
        testModule = nil
        super.tearDown()
    }

    // MARK: - 模組生成測試

    func testModuleGeneration() {
        let result = moduleManager.generateModule(name: "TestModule")
        XCTAssertTrue(result.success)
        XCTAssertNotNil(result.module)
        XCTAssertEqual(result.module?.name, "TestModule")
        XCTAssertEqual(result.module?.version, "1.0.0")
    }

    func testModuleGenerationWithInvalidName() {
        let result = moduleManager.generateModule(name: "")
        XCTAssertFalse(result.success)
        XCTAssertNil(result.module)
        XCTAssertEqual(result.error, .invalidName)
    }

    // MARK: - 模組擴充測試

    func testModuleExtension() {
        let features = ["feature1", "feature2", "feature3"]
        let result = moduleManager.extendModule(name: "TestModule", with: features)
        XCTAssertTrue(result.success)
        XCTAssertEqual(result.module?.features.count, features.count)
    }

    func testModuleExtensionWithDuplicateFeatures() {
        let features = ["feature1", "feature1", "feature2"]
        let result = moduleManager.extendModule(name: "TestModule", with: features)
        XCTAssertTrue(result.success)
        XCTAssertEqual(result.module?.features.count, 2) // 重複特徵應該被過濾
    }

    // MARK: - 模組更新測試

    func testModuleUpdate() {
        let newVersion = "1.1.0"
        let result = moduleManager.updateModule(name: "TestModule", to: newVersion)
        XCTAssertTrue(result.success)
        XCTAssertEqual(result.module?.version, newVersion)
    }

    func testModuleUpdateWithInvalidVersion() {
        let result = moduleManager.updateModule(name: "TestModule", to: "invalid")
        XCTAssertFalse(result.success)
        XCTAssertEqual(result.error, .invalidVersion)
    }

    // MARK: - 模組刪除測試

    func testModuleDeletion() {
        let result = moduleManager.deleteModule(name: "TestModule")
        XCTAssertTrue(result.success)
        XCTAssertNil(moduleManager.getModule(name: "TestModule"))
    }

    func testModuleDeletionOfNonExistentModule() {
        let result = moduleManager.deleteModule(name: "NonExistentModule")
        XCTAssertFalse(result.success)
        XCTAssertEqual(result.error, .moduleNotFound)
    }

    // MARK: - 模組依賴測試

    func testModuleDependencies() {
        let dependencies = ["Dependency1", "Dependency2"]
        let result = moduleManager.addDependencies(to: "TestModule", dependencies: dependencies)
        XCTAssertTrue(result.success)
        XCTAssertEqual(result.module?.dependencies.count, dependencies.count)
    }

    func testModuleDependenciesResolution() {
        let dependencies = ["Dependency1", "Dependency2"]
        _ = moduleManager.addDependencies(to: "TestModule", dependencies: dependencies)

        let result = moduleManager.resolveDependencies(for: "TestModule")
        XCTAssertTrue(result.success)
        XCTAssertEqual(result.dependencies?.count, dependencies.count)
    }

    // MARK: - 模組狀態測試

    func testModuleState() {
        let result = moduleManager.setModuleState(name: "TestModule", state: .enabled)
        XCTAssertTrue(result.success)
        XCTAssertEqual(result.module?.state, .enabled)
    }

    func testModuleStateTransition() {
        _ = moduleManager.setModuleState(name: "TestModule", state: .enabled)
        let result = moduleManager.setModuleState(name: "TestModule", state: .disabled)
        XCTAssertTrue(result.success)
        XCTAssertEqual(result.module?.state, .disabled)
    }

    // MARK: - 性能測試

    func testModuleGenerationPerformance() {
        measure {
            _ = moduleManager.generateModule(name: "PerformanceTestModule")
        }
    }

    func testModuleExtensionPerformance() {
        let features = (0 ..< 100).map { "feature\($0)" }
        measure {
            _ = moduleManager.extendModule(name: "TestModule", with: features)
        }
    }

    // MARK: - 錯誤處理測試

    func testErrorHandling() {
        let result = moduleManager.generateModule(name: "")
        XCTAssertFalse(result.success)
        XCTAssertNotNil(result.error)
        XCTAssertEqual(result.error, .invalidName)
    }

    func testErrorRecovery() {
        // 先創建一個無效的模組
        _ = moduleManager.generateModule(name: "")

        // 嘗試恢復
        let result = moduleManager.recoverModule(name: "TestModule")
        XCTAssertTrue(result.success)
        XCTAssertNotNil(result.module)
    }
}
