const http = require('http');
const net = require('net');

// 檢查端口是否被占用
function checkPort(port) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use`);
                resolve(false);
            } else {
                reject(err);
            }
        });
        
        server.once('listening', () => {
            server.close();
            console.log(`Port ${port} is available`);
            resolve(true);
        });
        
        server.listen(port);
    });
}

// 檢查服務器是否響應
function checkServer(port) {
    return new Promise((resolve) => {
        http.get(`http://localhost:${port}`, (res) => {
            console.log(`Server responded with status code: ${res.statusCode}`);
            resolve(true);
        }).on('error', (err) => {
            console.log(`Server check failed: ${err.message}`);
            resolve(false);
        });
    });
}

// 運行檢查
async function runChecks() {
    console.log('Starting server checks...');
    
    try {
        // 檢查端口 3002
        const portAvailable = await checkPort(3002);
        console.log('Port check completed');
        
        // 如果端口可用，嘗試啟動服務器
        if (portAvailable) {
            require('./server.js');
            
            // 等待服務器啟動
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 檢查服務器是否響應
            const serverResponding = await checkServer(3002);
            console.log(`Server responding: ${serverResponding}`);
        }
    } catch (err) {
        console.error('Check failed:', err);
    }
}

runChecks(); 