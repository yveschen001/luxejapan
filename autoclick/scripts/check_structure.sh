#!/bin/bash

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 檢查結果計數器
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# 檢查目錄是否存在
check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ 目錄存在: $1${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${RED}❌ 目錄不存在: $1${NC}"
        ((FAIL_COUNT++))
    fi
}

# 檢查文件是否存在
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ 文件存在: $1${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${RED}❌ 文件不存在: $1${NC}"
        ((FAIL_COUNT++))
    fi
}

# 檢查文件是否包含特定內容
check_file_content() {
    if [ -f "$1" ] && grep -q "$2" "$1"; then
        echo -e "${GREEN}✅ 文件包含內容: $1 -> $2${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${RED}❌ 文件不包含內容: $1 -> $2${NC}"
        ((FAIL_COUNT++))
    fi
}

# 檢查文件權限
check_file_permission() {
    if [ -f "$1" ] && [ -x "$1" ]; then
        echo -e "${GREEN}✅ 文件有執行權限: $1${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${YELLOW}⚠️ 文件無執行權限: $1${NC}"
        ((WARN_COUNT++))
    fi
}

# 檢查 Swift 文件格式
check_swift_format() {
    if [ -f "$1" ]; then
        if swiftformat --lint "$1" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Swift 格式正確: $1${NC}"
            ((PASS_COUNT++))
        else
            echo -e "${YELLOW}⚠️ Swift 格式需要修正: $1${NC}"
            ((WARN_COUNT++))
        fi
    fi
}

# 檢查 SwiftLint
check_swiftlint() {
    if [ -f "$1" ]; then
        if swiftlint lint "$1" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ SwiftLint 檢查通過: $1${NC}"
            ((PASS_COUNT++))
        else
            echo -e "${YELLOW}⚠️ SwiftLint 檢查未通過: $1${NC}"
            ((WARN_COUNT++))
        fi
    fi
}

# 檢查測試覆蓋率
check_test_coverage() {
    if [ -d "AutoClickerTests" ]; then
        coverage=$(xcrun xccov view --report --json AutoClicker.xcodeproj | grep -o '"lineCoverage":[0-9.]*' | cut -d':' -f2)
        if (( $(echo "$coverage >= 0.8" | bc -l) )); then
            echo -e "${GREEN}✅ 測試覆蓋率達標: $coverage${NC}"
            ((PASS_COUNT++))
        else
            echo -e "${YELLOW}⚠️ 測試覆蓋率不足: $coverage${NC}"
            ((WARN_COUNT++))
        fi
    fi
}

# 檢查構建配置
check_build_config() {
    if [ -f "AutoClicker.xcodeproj/project.pbxproj" ]; then
        if grep -q "SWIFT_VERSION = 5.0" "AutoClicker.xcodeproj/project.pbxproj"; then
            echo -e "${GREEN}✅ Swift 版本配置正確${NC}"
            ((PASS_COUNT++))
        else
            echo -e "${YELLOW}⚠️ Swift 版本配置需要檢查${NC}"
            ((WARN_COUNT++))
        fi
    fi
}

# 檢查本地化文件
check_localization() {
    if [ -d "AutoClicker/Resources/zh-Hans.lproj" ]; then
        echo -e "${GREEN}✅ 中文本地化文件存在${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${YELLOW}⚠️ 中文本地化文件缺失${NC}"
        ((WARN_COUNT++))
    fi
}

# 檢查目錄結構
echo "🔍 開始檢查目錄結構..."

# 檢查關鍵目錄
check_directory "AutoClicker"
check_directory "AutoClicker/Services"
check_directory "AutoClicker/ViewModels"
check_directory "AutoClicker/Views"
check_directory "AutoClicker/Resources"
check_directory "AutoClickerTests"

# 檢查核心文件
check_file "AutoClicker.xcodeproj/project.pbxproj"
check_file "Package.swift"
check_file "AutoClicker/AppDelegate.swift"
check_file "AutoClicker/SceneDelegate.swift"

# 檢查配置文件
check_file ".swiftlint.yml"
check_file ".gitignore"

# 檢查核心服務文件
check_file "AutoClicker/Services/AccessibilityEventService.swift"
check_file "AutoClicker/Services/ImageRecognitionService.swift"
check_file "AutoClicker/Services/ScriptActionPlayer.swift"

# 檢查構建配置
check_build_config

# 檢查本地化
check_localization

# 檢查 SwiftLint
echo "🔍 檢查代碼規範..."
for file in $(find AutoClicker -name "*.swift"); do
    check_swiftlint "$file"
done

# 檢查測試覆蓋率
echo "🔍 檢查測試覆蓋率..."
check_test_coverage

# 輸出檢查結果
echo -e "\n📊 檢查結果統計:"
echo -e "${GREEN}✅ 通過: $PASS_COUNT${NC}"
echo -e "${YELLOW}⚠️ 警告: $WARN_COUNT${NC}"
echo -e "${RED}❌ 失敗: $FAIL_COUNT${NC}"

# 如果有失敗項，返回非零狀態碼
if [ $FAIL_COUNT -gt 0 ]; then
    exit 1
fi 