import { mount } from '@vue/test-utils'
import KYC from './KYC.vue'
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

describe('KYC.vue', () => {
  it('應正確渲染標題', () => {
    const wrapper = mount(KYC, { global: { plugins: [i18n, createPinia()] } })
    expect(wrapper.text()).toContain('身份驗證（KYC）')
  })
  it('應有 KYC 按鈕', () => {
    const wrapper = mount(KYC, { global: { plugins: [i18n, createPinia()] } })
    expect(wrapper.find('button').exists()).toBe(true)
  })
}) 