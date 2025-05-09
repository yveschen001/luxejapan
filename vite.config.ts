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
      name: 'copy-404',
      closeBundle() {
        const fs = require('fs');
        if (fs.existsSync('dist/index.html')) {
          fs.copyFileSync('dist/index.html', 'dist/404.html');
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
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          const info = assetInfo as OutputAsset;
          const name = info.name || '';
          if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.webp')) {
            return 'assets/images/[name][extname]';
          }
          return 'assets/[name][extname]';
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