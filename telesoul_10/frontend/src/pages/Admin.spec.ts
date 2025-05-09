import { mount } from '@vue/test-utils'
import Admin from './Admin.vue'
import { createI18n } from 'vue-i18n'
import zh from '../i18n/locales/zh.json'
import en from '../i18n/locales/en.json'
import { createPinia } from 'pinia'

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: { zh, en },
})

describe('Admin.vue', () => {
  it('應正確渲染標題', () => {
    const wrapper = mount(Admin, { global: { plugins: [i18n, createPinia()] } })
    expect(wrapper.text()).toContain('後台管理')
  })
  it('應有管理功能描述', () => {
    const wrapper = mount(Admin, { global: { plugins: [i18n, createPinia()] } })
    expect(wrapper.text()).toContain('管理用戶、KYC、提領、報表等後台功能')
  })
}) 