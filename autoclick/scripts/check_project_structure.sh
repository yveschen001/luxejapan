#!/bin/bash

# 檢查項目結構
check_project_structure() {
    echo "檢查項目結構..."
    
    # 檢查必要目錄
    local required_dirs=(
        "AutoClicker"
        "AutoClickerTests"
        "scripts"
        "docs"
        ".github"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            echo "錯誤：缺少必要目錄 $dir"
            exit 1
        fi
    done
    
    # 檢查必要文件
    local required_files=(
        "Package.swift"
        ".swiftlint.yml"
        ".swift-version"
        "LICENSE"
        "CHANGELOG.md"
        ".gitignore"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            echo "錯誤：缺少必要文件 $file"
            exit 1
        fi
    done
    
    # 檢查 docs 目錄中的必要文件
    local required_docs=(
        "REQUIREMENTS.md"
        "PROJECT_PLAN_TODO.md"
        "UI_TESTS_PLAN.md"
        "UI_GUIDELINES.md"
        "STYLE_GUIDE.md"
        "SPEC.md"
        "SHORTCUTS.md"
        "SECURITY_POLICY.md"
        "QA_AUTOCHECK.md"
        "PROJECT_SYNC_PLAN.md"
        "NEXT_TASKS.md"
        "MODULE_MANAGEMENT.md"
        "LocalTestPlan.md"
        "IMAGE_RECOGNITION_RULES.md"
        "FINAL_CHECKLIST.md"
        "ENVIRONMENT_CONFIG.md"
        "DATA_SCHEMA.md"
        "APPSTORE_NOTES.md"
    )
    
    for doc in "${required_docs[@]}"; do
        if [ ! -f "docs/$doc" ]; then
            echo "錯誤：缺少必要文檔 docs/$doc"
            exit 1
        fi
    done
    
    echo "項目結構檢查完成"
}

# 檢查目錄結構
check_directory_structure() {
    echo "檢查目錄結構..."
    
    # 檢查 AutoClicker 目錄
    local required_autoclicker_dirs=(
        "App"
        "Views"
        "ViewModels"
        "Services"
        "Models"
        "Extensions"
        "Resources"
        "Assets.xcassets"
    )
    
    for dir in "${required_autoclicker_dirs[@]}"; do
        if [ ! -d "AutoClicker/$dir" ]; then
            echo "錯誤：AutoClicker/$dir 目錄不存在"
            exit 1
        fi
    done
    
    # 檢查 AutoClickerTests 目錄
    local required_test_files=(
        "ImageRecognitionServiceTests.swift"
        "AccessibilityEventServiceTests.swift"
        "ScriptActionPlayerTests.swift"
        "ScriptEngineTests.swift"
        "RecorderViewModelTests.swift"
        "ModuleManagerTests.swift"
        "ImageMatchViewTests.swift"
        "LogServiceTests.swift"
    )
    
    for file in "${required_test_files[@]}"; do
        if [ ! -f "AutoClickerTests/$file" ]; then
            echo "錯誤：AutoClickerTests/$file 文件不存在"
            exit 1
        fi
    done
    
    # 檢查 UI 測試目錄
    if [ ! -f "AutoClickerTests/PlaybackUITests.swift" ]; then
        echo "錯誤：UI 測試文件不存在"
        exit 1
    fi
    
    # 檢查 scripts 目錄
    if [ ! -f "scripts/auto_run.sh" ]; then
        echo "錯誤：scripts/auto_run.sh 文件不存在"
        exit 1
    fi
    
    echo "目錄結構檢查完成"
}

# 主函數
main() {
    check_project_structure
    check_directory_structure
}

main 