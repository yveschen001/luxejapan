@echo off
REM 删除旧文件
rmdir /s /q node_modules
del package-lock.json

REM 创建目录结构
mkdir css
mkdir js
mkdir images

REM 复制文件
copy ..\package.json .
copy ..\server.js .
copy ..\index.html .
copy ..\css\style.css css\
copy ..\js\app.js js\

REM 安装依赖
npm install

REM 启动服务器
npm start 