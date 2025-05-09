import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import zh from '../i18n/locales/zh.json';
import en from '../i18n/locales/en.json';
import { createPinia, setActivePinia } from 'pinia';
import { vi } from 'vitest';

// 配置 i18n
const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
  },
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  missingWarn: false,
  fallbackWarn: false,
});

// 全局配置
config.global.plugins = [i18n, createPinia()];
setActivePinia(createPinia());

// 全局模擬
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
  }),
  useRoute: () => ({
    path: '/',
    query: {},
    params: {},
  }),
}));

// 清理
afterEach(() => {
  vi.clearAllMocks();
});

// 模拟 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}); 