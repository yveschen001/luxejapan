@echo off
REM Windows 启动脚本

REM 检查并关闭已存在的 Node 进程
taskkill /F /IM node.exe

REM 安装依赖
call npm install

REM 启动服务器
call npm start 