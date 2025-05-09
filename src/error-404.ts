import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import en from './i18n/locales/en.json'
import ja from './i18n/locales/ja.json'
import zh from './i18n/locales/zh.json'
import 'tw-elements'
import './assets/main.css'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ja,
    zh
  }
})

const app = createApp(App)

app.use(router)
app.use(i18n)

// 设置 404 路由
router.replace('/404')

app.mount('#app') 