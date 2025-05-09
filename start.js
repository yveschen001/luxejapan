const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 检查并创建必要的目录和文件
const dirs = ['css', 'js', 'images'];
const files = {
    'css/style.css': fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf8'),
    'css/chat.css': '/* Chat styles */',
    'css/profile.css': '/* Profile styles */',
    'css/mbti.css': '/* MBTI styles */',
    'css/tasks.css': '/* Tasks styles */',
    'js/app.js': fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8'),
    'index.html': fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
};

// 创建目录
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// 创建文件
Object.entries(files).forEach(([file, content]) => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, content);
        console.log(`Created file: ${file}`);
    }
});

// 安装依赖
console.log('Installing dependencies...');
exec('npm install', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error installing dependencies: ${error}`);
        return;
    }
    console.log('Dependencies installed successfully');
    
    // 启动服务器
    console.log('Starting server...');
    require('./server.js');
}); 