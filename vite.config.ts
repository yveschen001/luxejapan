import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import type { OutputAsset } from 'rollup'

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

        // 复制必要的资源
        if (fs.existsSync('dist/assets')) {
          fs.cpSync('dist/assets', 'dist/assets', { recursive: true });
        }
      }
    },
    {
      name: 'copy-manifest',
      closeBundle() {
        const fs = require('fs');
        if (fs.existsSync('site.webmanifest')) {
          fs.copyFileSync('site.webmanifest', 'dist/site.webmanifest');
        }
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
  }
}) 