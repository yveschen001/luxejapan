# 见 heaven/Dockerfile 全部内容

# --------------------------------------------------------------------------------------------------
# Stage 1：构建阶段，安装 Node.js + Chromium（供 Puppeteer 使用）
# --------------------------------------------------------------------------------------------------
FROM node:18-slim AS builder

# 设置工作目录
WORKDIR /app

# 安装必要工具以及 Chromium 依赖
RUN apt-get update \
    && apt-get install -y \
       ca-certificates \
       wget \
       gnupg \
       apt-transport-https \
       fonts-liberation \
       libatk-bridge2.0-0 \
       libatspi2.0-0 \
       libgtk-3-0 \
       libxss1 \
       libgbm1 \
       libgtk2.0-0 \
       libasound2 \
       chromium \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 告诉 Puppeteer 不要再自动下载 Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装生产环境依赖
RUN npm ci --only=production

# --------------------------------------------------------------------------------------------------
# Stage 2：运行时阶段，只包含必要的文件
# --------------------------------------------------------------------------------------------------
FROM node:18-slim

# 设置工作目录
WORKDIR /app

# 安装 Chromium 及其依赖
RUN apt-get update \
    && apt-get install -y \
       ca-certificates \
       wget \
       gnupg \
       apt-transport-https \
       fonts-liberation \
       libatk-bridge2.0-0 \
       libatspi2.0-0 \
       libgtk-3-0 \
       libxss1 \
       libgbm1 \
       libgtk2.0-0 \
       libasound2 \
       chromium \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 从构建阶段复制 node_modules
COPY --from=builder /app/node_modules ./node_modules

# 复制源代码和配置文件
COPY src ./src
COPY package.json ./

# 设置环境变量
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "src/index.js"] 