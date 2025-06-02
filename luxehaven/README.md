# LuxeHaven Scraper

## 项目简介

LuxeHaven Scraper 是一个基于 Puppeteer 的网页抓取服务，提供 RESTful API 接口用于抓取指定页面的 HTML 内容。本项目遵循严格的代码规范和最佳实践，确保代码质量和可维护性。

## 技术栈

- Node.js 18+
- Express.js
- Puppeteer
- Docker

## 目录结构

```
luxehaven/
├── src/                    # 源代码目录
│   ├── config/            # 配置文件
│   ├── routes/            # API 路由
│   ├── services/          # 业务逻辑
│   ├── utils/             # 工具函数
│   └── index.js           # 应用入口
├── public/                # 静态资源
├── .github/              # GitHub 配置
├── Dockerfile            # Docker 配置
└── package.json          # 项目配置
```

## 开发环境设置

1. 克隆仓库
   ```bash
   git clone https://github.com/yveschen001/luxejapan.git
   cd luxehaven
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，设置必要的环境变量
   ```

4. 启动开发服务器
   ```bash
   npm run dev
   ```

## API 文档

### 健康检查
```http
GET /healthz
```
响应：
```json
{
  "status": "OK"
}
```

### 页面抓取
```http
POST /scrape
Content-Type: application/json

{
  "url": "https://example.com"
}
```
响应：
```json
{
  "html": "<html>...</html>",
  "timestamp": "2024-03-21T12:00:00Z"
}
```

## 部署指南

### Docker 部署

1. 构建镜像
   ```bash
   docker build -t luxehaven-scraper .
   ```

2. 运行容器
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
     --name luxehaven-scraper \
     luxehaven-scraper
   ```

### RunPod 部署

1. 创建新的 Pod
   - 选择 GPU 模板
   - 配置环境变量
   - 上传 Dockerfile

2. 启动服务
   - 等待构建完成
   - 检查服务状态
   - 配置域名（可选）

## 开发规范

- 代码风格遵循 `.eslintrc.json` 和 `.prettierrc` 配置
- 提交信息遵循 Conventional Commits 规范
- 所有 API 接口需要添加 JSDoc 注释
- 确保代码测试覆盖率不低于 80%

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -m 'feat: 添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 创建 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件 