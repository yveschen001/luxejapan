#!/bin/bash
set -e

npm run build

cd dist
git init
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/luxejapan/luxejapan-public.git
git checkout -B gh-pages
git add .
git commit -m "deploy: 自动同步本地稳定版本到 gh-pages"
git push -f origin gh-pages

cd ..
echo "✅ 已自动部署到 luxejapan-public 仓库 gh-pages 分支！" 