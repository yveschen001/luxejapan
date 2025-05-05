#!/bin/bash

# 创建目录结构
mkdir -p css js images

# 创建基本的 CSS
echo "body { margin: 0; padding: 20px; font-family: sans-serif; }" > css/style.css

# 创建基本的 JS
echo "console.log('App loaded');" > js/app.js

# 删除旧的依赖（如果存在）
rm -rf node_modules package-lock.json

# 安装新的依赖
npm install

# 启动服务器
npm start 