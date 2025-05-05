@echo off

REM 创建目录结构
mkdir css
mkdir js
mkdir images

REM 创建基本的 CSS
echo body { margin: 0; padding: 20px; font-family: sans-serif; } > css\style.css

REM 创建基本的 JS
echo console.log('App loaded'); > js\app.js

REM 删除旧的依赖
rmdir /s /q node_modules
del package-lock.json

REM 安装新的依赖
npm install

REM 启动服务器
npm start 