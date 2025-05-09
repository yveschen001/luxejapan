import { mount } from '@vue/test-utils'
import Register from './Register.vue'
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

describe('Register.vue', () => {
  const createWrapper = () => {
    return mount(Register, {
      global: { plugins: [i18n, createPinia()] }
    })
  }

  it('應正確渲染標題', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('h1').text()).toBe('註冊帳號')
  })

  it('應包含必要的表單元素', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('密碼不一致時應顯示錯誤提示', async () => {
    const wrapper = createWrapper()
    const passwordInputs = wrapper.findAll('input[type="password"]')
    
    await passwordInputs[0].setValue('password123')
    await passwordInputs[1].setValue('password456')
    await wrapper.find('form').trigger('submit')
    await nextTick()
    
    expect(wrapper.text()).toContain('密碼不一致')
  })

  it('表單驗證失敗時不應提交', async () => {
    const wrapper = createWrapper()
    const form = wrapper.find('form')
    
    await form.trigger('submit')
    await nextTick()
    
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('表單驗證通過時應正確提交', async () => {
    const wrapper = createWrapper()
    const form = wrapper.find('form')
    const inputs = wrapper.findAll('input')
    
    await inputs[0].setValue('testuser')
    await inputs[1].setValue('test@example.com')
    await inputs[2].setValue('password123')
    await inputs[3].setValue('password123')
    
    await form.trigger('submit')
    await nextTick()
    
    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })
  })
}) 