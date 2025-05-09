import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'

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
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), manifestBasePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
}) 