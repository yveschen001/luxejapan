#!/bin/bash

# 创建测试目录
mkdir -p AutoClickerTests/AutoClickerTests
mkdir -p AutoClickerTests/AutoClickerUITests

# 移动测试文件
mv AutoClicker/Tests/*.swift AutoClickerTests/AutoClickerTests/
mv AutoClicker/Tests/UITests/*.swift AutoClickerTests/AutoClickerUITests/

# 删除空目录
rm -rf AutoClicker/Tests

echo "✅ 测试文件位置已修复" 