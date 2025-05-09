import { mount } from '@vue/test-utils'
import Home from './Home.vue'
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

describe('Home.vue', () => {
  const createWrapper = (props = {}) => {
    return mount(Home, {
      props,
      global: { plugins: [i18n, createPinia()] }
    })
  }

  it('應正確渲染標題', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('h1').text()).toBe('TeleSoul')
  })

  it('應正確渲染開始按鈕', () => {
    const wrapper = createWrapper()
    const startButton = wrapper.find('a[href="/register"]')
    expect(startButton.exists()).toBe(true)
    expect(startButton.text()).toBe('立即開始')
  })

  it('點擊開始按鈕應觸發事件', async () => {
    const wrapper = createWrapper()
    const startButton = wrapper.find('a[href="/register"]')
    
    await startButton.trigger('click')
    await nextTick()
    
    const emitted = wrapper.emitted('start')
    expect(emitted).toBeTruthy()
  })

  it('未登入時應顯示登入提示', () => {
    const wrapper = createWrapper({ isLoggedIn: false })
    expect(wrapper.text()).toContain('已有帳號？登入')
  })

  it('已登入時應顯示用戶狀態', () => {
    const wrapper = createWrapper({ isLoggedIn: true })
    expect(wrapper.text()).not.toContain('已有帳號？登入')
  })

  it('應正確渲染功能卡片', () => {
    const wrapper = createWrapper()
    const cards = wrapper.findAll('.telesoul-card')
    expect(cards).toHaveLength(3)
    
    expect(cards[0].text()).toContain('智能配對')
    expect(cards[1].text()).toContain('安全合規')
    expect(cards[2].text()).toContain('即時互動')
  })
}) 