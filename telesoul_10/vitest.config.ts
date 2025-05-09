import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    include: [
      'frontend/src/**/*.spec.ts',
      'frontend/src/**/*.test.ts',
      'backend/src/**/*.spec.ts',
      'backend/src/**/*.test.ts'
    ],
    environment: 'jsdom',
    globals: true,
    setupFiles: [
      'frontend/src/tests/setup.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/types.ts',
        '**/setup.ts',
        '**/mocks/**'
      ],
      include: [
        'frontend/src/**/*.{ts,vue}',
        'backend/src/**/*.ts'
      ]
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/src'),
    },
  },
}) 