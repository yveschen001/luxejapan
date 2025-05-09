import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import en from './i18n/en.json';
import zhTw from './i18n/zh-tw.json';
import ko from './i18n/ko.json';
import vi from './i18n/vi.json';
import es from './i18n/es.json';
import '/styles.css';

// 自动检测用户语言
const supportedLocales = ['en', 'zh-tw', 'ko', 'vi', 'es'];
function detectDefaultLocale() {
  // 优先localStorage
  const saved = localStorage.getItem('language');
  if (saved && supportedLocales.includes(saved)) return saved;
  // 浏览器首选
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh-tw';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('vi')) return 'vi';
  if (browserLang.startsWith('es')) return 'es';
  // 默认英文
  return 'en';
}
const defaultLocale = detectDefaultLocale();
const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-tw': zhTw,
    ko,
    vi,
    es
  }
});

// 处理默认语言重定向
router.beforeEach((to, from, next) => {
  const path = to.path;
  const supportedLocales = ['en', 'zh-tw', 'ko', 'vi', 'es'];
  const pathLocale = path.split('/')[1];
  // 只在本地开发环境做 locale 自动跳转
  const isDev = import.meta.env.BASE_URL === '/';
  if (isDev && !supportedLocales.includes(pathLocale)) {
    const currentLocale = i18n.global.locale.value;
    if (path === '/') {
      next(`/${currentLocale}`);
    } else {
      next(`/${currentLocale}${path}`);
    }
  } else {
    // 路径有语言前缀，强制同步 i18n locale
    if (supportedLocales.includes(pathLocale) && i18n.global.locale.value !== pathLocale) {
      i18n.global.locale.value = pathLocale;
      localStorage.setItem('language', pathLocale);
    }
    next();
  }
});

const app = createApp(App);
app.use(router);
app.use(i18n);

// 添加全局错误处理
app.config.errorHandler = (err, vm, info) => {
  // 忽略 Web3 相关的错误
  if (err.message && err.message.includes('Cannot read properties of null')) {
    console.warn('Ignored Web3 related error:', err);
    return;
  }
  console.error('Vue Error:', err);
};

// 添加全局未捕获的 Promise 错误处理
window.addEventListener('unhandledrejection', (event) => {
  // 忽略 Web3 相关的错误
  if (event.reason && event.reason.message && event.reason.message.includes('Cannot read properties of null')) {
    console.warn('Ignored Web3 related error:', event.reason);
    event.preventDefault();
    return;
  }
  console.error('Unhandled Promise Rejection:', event.reason);
});

app.mount('#app'); 