#!/bin/bash
# Mac/Linux 启动脚本

echo "Setting up MysticTalk..."

# 创建必要的目录
mkdir -p css js images public/demo public/images

# 清理旧文件
rm -rf node_modules package-lock.json

# 复制文件到正确的位置
cp register.html public/demo/
cp images/* public/images/

# 安装依赖
npm install

# 确保文件存在
touch css/style.css js/app.js

# 启动服务器
echo "Starting server..."
node server.js 