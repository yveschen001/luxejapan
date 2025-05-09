import { createI18n } from '@intlify/vue-i18n';
import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-TW': zhTW,
  },
});

export default i18n; 