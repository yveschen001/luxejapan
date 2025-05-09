import { mount } from '@vue/test-utils'
import Login from './Login.vue'
import { createI18n } from 'vue-i18n'
import zh from '../i18n/locales/zh.json'
import en from '../i18n/locales/en.json'
import { createPinia } from 'pinia'
import { nextTick } from 'vue'

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: { zh, en },
})

describe('Login.vue', () => {
  const createWrapper = () => {
    return mount(Login, {
      global: { plugins: [i18n, createPinia()] }
    })
  }

  it('正確渲染標題', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('登入')
  })

  it('正確渲染表單元素', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('表單驗證失敗時不提交', async () => {
    const wrapper = createWrapper()
    const form = wrapper.find('form')
    
    await form.trigger('submit')
    await nextTick()
    
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('正確處理表單提交', async () => {
    const wrapper = createWrapper()
    const form = wrapper.find('form')
    
    await wrapper.find('input[type="text"]').setValue('testuser')
    await wrapper.find('input[type="password"]').setValue('password123')
    
    await form.trigger('submit')
    await nextTick()
    
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('顯示錯誤信息', async () => {
    const wrapper = createWrapper()
    const errorMessage = '登入失敗'
    
    await wrapper.setData({ error: errorMessage })
    await nextTick()
    
    expect(wrapper.text()).toContain(errorMessage)
  })
}) 