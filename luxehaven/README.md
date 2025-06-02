# Puppeteer Scraper

## 项目简介

这是一个使用 Puppeteer 进行页面抓取的服务，提供 `/scrape` API 接口抓取指定页面的 HTML 内容，并返回结构化数据。

## 安装与运行

1. 克隆本仓库
   ```bash
   git clone https://github.com/yourusername/puppeteer-scraper.git
   cd puppeteer-scraper
   ```
2. 安装依赖
   ```bash
   npm install
   ```
3. 启动服务
   ```bash
   npm start
   ```
4. 访问服务：http://localhost:3000

## API 接口

### POST /scrape
请求体：
```json
{
  "url": "https://www.cityheaven.net/"
}
```
响应：
```json
{
  "html": "<html>...</html>"
}
```

### GET /healthz
健康检查接口，返回 OK。

## 部署

可以将此服务部署到 RunPod 或在本地开发环境中运行。确保您的环境支持 Puppeteer 的 Chromium 启动。

### Docker 部署

1. 构建镜像：
   ```bash
   docker build -t puppeteer-scraper .
   ```
2. 运行容器：
   ```bash
   docker run -p 3000:3000 puppeteer-scraper
   ```
3. 访问服务：打开浏览器，访问 http://localhost:3000。

### RunPod 部署

1. 创建一个新的 Pod：在 RunPod 上创建一个新的 Pod，并选择使用 Docker 运行您的 Puppeteer 服务。
2. 配置环境变量：设置 PUPPETEER_EXECUTABLE_PATH 环境变量，确保 Puppeteer 可以找到正确的 Chromium 路径。
3. 启动并访问服务：确认服务正常运行后，使用提供的公网地址访问您的爬虫服务。 