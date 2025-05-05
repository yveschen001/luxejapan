#!/bin/bash
set -e

echo "🧪 開始自動化測試..."

# 清理舊的 build
rm -rf build DerivedData

# 執行所有單元測試與 UI 測試
xcodebuild test -scheme AutoClicker -destination 'platform=macOS' -enableCodeCoverage YES

# 查看測試覆蓋率
echo "📊 測試覆蓋率："
xcresult_path=$(find ./DerivedData -name "*.xcresult" | tail -n 1)
if [ -n "$xcresult_path" ]; then
    xcrun xccov view --report --json "$xcresult_path"
else
    echo "⚠️ 未找到覆蓋率報告"
fi

# 打包 Release 版本
xcodebuild -scheme AutoClicker -configuration Release -derivedDataPath build

echo "✅ 測試與打包完成！" 