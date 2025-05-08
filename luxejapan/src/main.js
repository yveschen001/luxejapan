import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import en from './i18n/en.json';
import zhTw from './i18n/zh-tw.json';
import '/styles.css';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-tw': zhTw
  }
});

// 處理默認語言重定向
router.beforeEach((to, from, next) => {
  const { locale } = i18n.global;
  const path = to.path;
  
  // 如果路徑不包含語言前綴，添加當前語言前綴
  if (!path.startsWith('/en') && !path.startsWith('/zh-tw')) {
    next(`/${locale.value}${path}`);
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app'); 