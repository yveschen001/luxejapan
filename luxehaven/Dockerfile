# 见 heaven/Dockerfile 全部内容

# --------------------------------------------------------------------------------------------------
# Stage 1：构建阶段，安装 Node.js + Chromium（供 Puppeteer 使用）
# --------------------------------------------------------------------------------------------------
FROM node:18-slim AS builder

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
    && rm -rf /var/lib/apt/lists/*

# 告诉 Puppeteer 不要再自动下载 Chrominium，因为我们已经安装了系统的 chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 创建工作目录并复制 package.json
WORKDIR /app
COPY package.json package-lock.json ./
# 安装生产环境依赖
RUN npm install --omit=dev

# --------------------------------------------------------------------------------------------------
# Stage 2：运行时阶段，只需要 Node + Chromium
# --------------------------------------------------------------------------------------------------
FROM node:18-slim

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
    && rm -rf /var/lib/apt/lists/*

# 复制已安装的 node_modules
COPY --from=builder /app/node_modules /app/node_modules

# 复制服务代码
COPY . /app

WORKDIR /app

# 指定 Puppeteer 使用系统安装的 Chromium
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

EXPOSE 3000
CMD ["npm", "start"] 