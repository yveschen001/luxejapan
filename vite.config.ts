import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import type { OutputAsset } from 'rollup'
import path from 'path'
import fsExtra from 'fs-extra'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'generate-404',
      closeBundle() {
        // 读取 Error404 页面的内容
        const error404Content = fs.readFileSync('dist/index.html', 'utf-8')
          .replace(/<title>.*?<\/title>/, '<title>404 - Page Not Found</title>')
          .replace(/<div id="app">.*?<\/div>/s, '<div id="app"><div class="error-404" data-test="error-404" role="alert" aria-live="polite"><div class="error-404__content"><h1 class="error-404__title">404</h1><p class="error-404__text">Page Not Found</p><a href="/" class="error-404__link" data-test="back-to-home" aria-label="Back to Home">Back to Home</a></div></div></div>')
          .replace(/<script type="module" src=".*?"><\/script>/s, '<script type="module" src="/assets/error-404.js"></script>');

        // 写入 404.html
        fs.writeFileSync('dist/404.html', error404Content);
      }
    },
    {
      name: 'copy-manifest',
      closeBundle() {
        const fs = require('fs');
        const path = require('path');
        // 只复制 public/site.webmanifest 到 dist 根目录
        const src = path.resolve(__dirname, 'public/site.webmanifest');
        const dest = path.resolve(__dirname, 'dist/site.webmanifest');
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
        // 删除 dist/assets/site.webmanifest（如有）
        const wrongManifest = path.resolve(__dirname, 'dist/assets/site.webmanifest');
        if (fs.existsSync(wrongManifest)) {
          fs.unlinkSync(wrongManifest);
        }
      }
    },
    {
      name: 'fix-manifest-path-in-html',
      closeBundle() {
        const fs = require('fs');
        const path = require('path');
        const htmlFiles = ['dist/index.html', 'dist/404.html'];
        htmlFiles.forEach(file => {
          if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf-8');
            // 修正 manifest 路径
            content = content.replace(/<link rel="manifest" href="[^"]*">/, '<link rel="manifest" href="/luxejapan-public/site.webmanifest">');
            // 修正所有 icon 路径
            content = content.replace(/href="images\//g, 'href="/luxejapan-public/images/');
            content = content.replace(/href='images\//g, "href='/luxejapan-public/images/");
            fs.writeFileSync(file, content, 'utf-8');
          }
        });
      }
    },
    {
      name: 'copy-images',
      closeBundle() {
        // 拷贝 public/images 到 dist/images
        const srcDir = path.resolve(__dirname, 'public/images');
        const destDir = path.resolve(__dirname, 'dist/images');
        if (fsExtra.existsSync(srcDir)) {
          fsExtra.copySync(srcDir, destDir, { overwrite: true });
        }
        // 额外拷贝 public 根目录下所有 favicon、icon、manifest 相关文件到 dist/images
        const publicDir = path.resolve(__dirname, 'public');
        const distImagesDir = path.resolve(__dirname, 'dist/images');
        const filesToCopy = [
          'favicon.ico',
          'favicon-16x16.png',
          'favicon-32x32.png',
          'apple-touch-icon.png',
          'android-chrome-192x192.png',
          'android-chrome-512x512.png',
          'favicon-16x16.webp',
          'favicon-32x32.webp',
          'apple-touch-icon.webp',
          'android-chrome-192x192.webp',
          'android-chrome-512x512.webp'
        ];
        filesToCopy.forEach(file => {
          const src = path.resolve(publicDir, file);
          const dest = path.resolve(distImagesDir, file);
          if (fsExtra.existsSync(src)) {
            fsExtra.copySync(src, dest, { overwrite: true });
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: process.env.NODE_ENV === 'production' ? '/luxejapan-public/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        en: 'index.html',
        zh: 'index.html',
        'zh-tw': 'index.html',
        ko: 'index.html',
        vi: 'index.html',
        es: 'index.html'
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name) {
            if (/\.(png|jpe?g|webp|svg)$/.test(assetInfo.name)) {
              return 'images/[name][extname]'
            }
          }
          return 'assets/[name][extname]'
        }
      }
    }
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    },
    // Vite 默认已支持 HTML5 history fallback，无需额外配置
  },
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toLocaleString())
  }
}) 