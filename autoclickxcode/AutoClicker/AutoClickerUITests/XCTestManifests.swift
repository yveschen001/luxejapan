import XCTest

#if !canImport(ObjectiveC)
    public func allTests() -> [XCTestCaseEntry] {
        [
            testCase(PlaybackUITests.allTests),
        ]
    }
#endif
