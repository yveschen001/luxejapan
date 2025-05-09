const express = require('express');
const path = require('path');
const app = express();

// 设置静态文件目录
app.use(express.static('public'));

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 注册页面路由
app.get('/demo/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/demo/register.html'));
});

// 添加重定向，处理拼写错误
app.get('/demo/registry', (req, res) => {
    res.redirect('/demo/register');
});

// 健康检查
app.get('/health', (req, res) => {
    res.send('OK');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`访问注册演示页面: http://localhost:${PORT}/demo/register`);
}); 