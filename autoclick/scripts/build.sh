#!/bin/bash

# 顯示可用的目標設備
echo "可用的目標設備："
xcodebuild -showdestinations

# 使用默認的 macOS 目標設備進行構建
xcodebuild -scheme AutoClicker -configuration Debug -destination "platform=macOS" build

# 檢查構建結果
if [ $? -eq 0 ]; then
    echo "✅ 構建成功"
else
    echo "❌ 構建失敗"
    exit 1
fi 