import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import en from './i18n/en.json'
import zhTw from './i18n/zh-tw.json'
import ko from './i18n/ko.json'
import vi from './i18n/vi.json'
import es from './i18n/es.json'
import 'tw-elements'
import './assets/main.css'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-tw': zhTw,
    ko,
    vi,
    es
  }
})

const app = createApp(App)

app.use(router)
app.use(i18n)

// 获取当前路径的语言前缀
const path = window.location.pathname
const localeMatch = path.match(/^\/([^/]+)/)
const locale = localeMatch ? localeMatch[1] : 'en'

// 设置404路由，保留语言前缀
router.replace(`/${locale}/404`)

app.mount('#app') 