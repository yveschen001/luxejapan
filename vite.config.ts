import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import type { OutputAsset } from 'rollup'

// 自定义插件：构建时替换 manifest base
function manifestBasePlugin() {
  return {
    name: 'manifest-base-replace',
    closeBundle() {
      const base = process.env.NODE_ENV === 'production' ? '/luxejapan-public/' : '/';
      const manifestPath = 'dist/site.webmanifest';
      if (fs.existsSync(manifestPath)) {
        let content = fs.readFileSync(manifestPath, 'utf-8');
        content = content.replace(/__BASE__/g, base);
        fs.writeFileSync(manifestPath, content, 'utf-8');
      }
    },
    transformIndexHtml(html) {
      const base = process.env.NODE_ENV === 'production' ? '/luxejapan-public/' : '/';
      return html.replace(/__BASE__/g, base);
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    manifestBasePlugin(),
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