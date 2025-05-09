#!/bin/bash

# 删除旧文件
rm -rf node_modules package-lock.json

# 创建目录结构
mkdir -p css js images

# 复制文件
cp ../package.json .
cp ../server.js .
cp ../index.html .
cp ../css/style.css css/
cp ../js/app.js js/

# 安装依赖
npm install

# 启动服务器
npm start

# 设置权限
chmod +x setup.sh 