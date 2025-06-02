# CityHeaven Puppeteer Scraper 项目规范与任务推进指引

> 本指引结合当前项目结构、团队协作需求和云端部署场景，分阶段列出每一步的目标、规范和注意事项。  
> 建议每完成一个阶段，都在本地和 RunPod 上充分测试，确保无误后再进入下一阶段。

---

## 1. 项目初始化与本地开发环境

### 1.1 仓库与目录结构
- [x] 在 GitHub 创建私有仓库（如 `luxejapan/heaven`）。
- [x] 本地 clone 仓库，初始化 Node.js 项目。
- [x] 目录结构如下（已完成）：
  ```
  /luxehaven
    ├─ src/
    │   ├─ index.js
    │   ├─ routes/
    │   ├─ services/
    │   ├─ utils/
    │   └─ config/
    ├─ public/
    ├─ Dockerfile
    ├─ .gitignore
    ├─ README.md
    ├─ CONTRIBUTING.md
    ├─ LICENSE
    ├─ .cursorrules
    ├─ package.json
    ├─ package-lock.json
    ├─ .eslintrc.json
    ├─ .prettierrc
    └─ .github/workflows/auto-build.yml
  ```

### 1.2 安装依赖
- [x] 生产依赖：`express puppeteer puppeteer-extra puppeteer-extra-plugin-stealth body-parser dotenv`
- [x] 开发依赖：`eslint prettier jest supertest`
- [x] 初始化 ESLint/Prettier 配置

### 1.3 .gitignore
- [x] 忽略 node_modules、.env、dist、logs、*.log 等

---

## 2. 核心代码开发与本地测试

### 2.1 环境变量与配置
- [x] `.env.example` 模板，实际开发用 `.env`（不提交到 Git）
- [x] `src/config/envConfig.js` 统一导出配置

### 2.2 日志工具
- [x] `src/utils/logger.js`，带时间戳的 info/error 封装

### 2.3 Puppeteer 服务
- [x] `src/services/puppeteerService.js` 封装页面抓取逻辑
- [ ] 可选：集成 Cheerio 做结构化数据提取

### 2.4 路由
- [x] `src/routes/healthz.js` 健康检查
- [x] `src/routes/scrape.js` 页面抓取
- [ ] 可选：`src/routes/batch.js` 支持批量爬取

### 2.5 入口文件
- [x] `src/index.js` 挂载所有路由，启动服务

### 2.6 本地测试
- [x] 本地设置 PUPPETEER_EXECUTABLE_PATH，启动服务
- [x] curl/Postman 测试 /healthz 和 /scrape

---

## 3. Docker 化与云端部署

### 3.1 Dockerfile
- [x] 多阶段构建，生产镜像内含 Chromium
- [x] ENV 配置 Puppeteer 路径

### 3.2 本地 Docker 测试
- [x] 构建镜像并本地运行，curl 验证接口

### 3.3 RunPod 部署
- [x] 创建模板，配置端口和环境变量
- [x] 部署 Pod，公网访问接口
- [x] 日志排查与常见问题处理

---

## 4. 持续集成与自动化

### 4.1 GitHub Actions
- [x] `.github/workflows/auto-build.yml` 自动构建与推送 Docker 镜像
- [ ] 集成 Lint、Prettier、Jest 测试步骤
- [ ] 配置 Secrets（DOCKERHUB_USERNAME/DOCKERHUB_PASSWORD）

### 4.2 单元测试
- [ ] `src/__tests__/puppeteerService.test.js`，用 Jest 测试核心服务

---

## 5. 进阶功能与后续迭代

### 5.1 批量爬取
- [ ] `src/services/batchService.js` 实现全站批量爬取
- [ ] 路由与接口设计，支持批量任务触发与监控

### 5.2 数据持久化
- [ ] 集成 MongoDB/SQLite/JSON 文件，保存结构化数据

### 5.3 前端展示
- [ ] Next.js/React 展示爬取结果

### 5.4 权限与安全
- [ ] API Key 验证，防止接口滥用

### 5.5 监控与自动重启
- [ ] RunPod 日志监控，自动重启脚本

---

## 6. 规范与协作

- [x] 所有文档、规范、配置文件均在根目录
- [x] 代码风格统一，Lint/Prettier 检查
- [x] 贡献流程清晰，PR/分支/提交信息规范
- [x] `.cursorrules` 约束团队开发标准

---

## 7. 每阶段完成后务必 Checklist

- [x] 本地功能全部测试通过
- [x] Docker 镜像本地可用
- [x] RunPod 云端接口可访问
- [x] CI/CD 流程全部通过
- [x] 文档与代码同步更新

---

## 8. SEO 友好的静态页面生成与站内搜索/广告配置

### 8.1 SEO 元信息与 Open Graph 标签
- [ ] 模板 `<head>` 注入 `<title>`、`<meta name="description">`、`<meta name="keywords">`、`<meta name="robots">`、`<link rel="canonical">` 等  
- [ ] 模板中注入 Open Graph / Twitter Card 标签（og:title、og:description、og:image、og:url、twitter:title 等）  
- [ ] 每个页面动态生成 `pageTitle`、`pageDescription`、`pageKeywords`、`pageCanonicalUrl`、`pageImage` 等字段

### 8.2 sitemap.xml 与 robots.txt
- [ ] 编写 `generate-sitemap.js`，批量生成 `public/sitemap.xml`（读取 `urls.json` 中所有页面路径）  
- [ ] 创建并维护 `public/robots.txt`，配置允许/禁止抓取规则，指向 sitemap

### 8.3 静态页面 URL 规范与目录结构
- [ ] 生成 SEO 友好的扁平目录结构（如 `/tokyo/girlid-60046518.html`）  
- [ ] 模板渲染时 `slugify` 路径，保持 URL 简洁  
- [ ] 每个页面生成 Schema.org JSON-LD 结构化数据

### 8.4 站内搜索功能
- [ ] 选定搜索方案（Lunr.js/Fuse.js/Google CSE/Algolia）  
- [ ] 构建脚本生成 `public/search-index.json`（如用前端本地索引）  
- [ ] 前端模板集成搜索交互逻辑，渲染搜索结果

### 8.5 广告位与联系方式可配置化
- [ ] 编写 `adsConfig.json`，支持全局与分区域广告、联系人配置  
- [ ] 模板插槽支持 `{{{ads.global.headerAd}}}`、`{{{ads.perRegion[region].sidebarAd}}}` 等  
- [ ] 构建脚本读取 `adsConfig.json`，渲染到静态页面

### 8.6 静态 HTML 页面批量生成
- [ ] 编写 `build.js`，实现：
  1. 读取 `data/` 目录里所有已抓取并解析好的 `girlid-XXXX.json`（结构化字段）  
  2. 根据模板（Handlebars/EJS/Nunjucks）把每条数据渲染成对应的静态 HTML  
     - 模板里须包含：SEO 元信息（title/description/keywords）、Open Graph、JSON-LD（Schema.org）、广告位插槽、搜索索引字段、联系信息等占位  
  3. 按照约定的目录结构（如 `public/tokyo/girlid-60046518.html`）把生成好的 HTML 写入 `public/` 目录  
  4. 同时在 `build.js` 里生成或更新：
     - `public/sitemap.xml`
     - `public/robots.txt`
     - `public/search-index.json`
- [ ] 本地执行 `node build.js`，观察 `public/` 目录下生成的文件数量与结构是否正确，确保能在本地直接预览所有页面  
- [ ] 将 `public/` 整个文件夹推到托管平台（如 GitHub Pages、S3、Vercel），并验证访问

### 8.7 批量爬取与数据结构优化
- [ ] 批量爬取后生成 `urls.json`，供 sitemap、索引、页面生成等使用  
- [ ] 优化批量爬取并发与错误重试逻辑

### 8.8 CI/CD 集成与自动化
- [ ] 在 CI/CD 流程中集成 sitemap、robots.txt、search-index.json、静态页面自动生成  
- [ ] 自动推送到静态托管（如 GitHub Pages、S3、Vercel 等）

### 8.9 监控与维护
- [ ] 定期检查 SEO 相关文件（sitemap、robots.txt、meta 标签）是否最新  
- [ ] 监控静态页面访问与搜索功能可用性

--- 