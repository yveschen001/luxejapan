#!/bin/bash
set -e

echo "[1/5] 確保 i18n 文件已提交..."
git add src/i18n/*.json
git commit -m "chore: 自動同步 i18n 文件" || true
git push

echo "[2/5] 清理 dist 及緩存..."
rm -rf dist node_modules/.vite .vite .cache

echo "[3/5] 重新 build..."
npm run build

cp dist/index.html dist/404.html

cd dist
git init
git add .
git commit -m "deploy: 全自動 i18n 同步與靜態資源修正"
git branch -M gh-pages
git remote add origin https://github.com/luxejapan/luxejapan-public.git
git push -f origin gh-pages
cd ..

echo "[4/5] 部署完成！請刷新頁面驗證 i18n 文案與資源。" 