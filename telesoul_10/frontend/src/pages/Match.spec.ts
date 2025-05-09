import { mount } from '@vue/test-utils'
import Match from './Match.vue'
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

describe('Match.vue', () => {
  const mockMatch = {
    id: 1,
    status: 'waiting',
    partner: null
  }

  const createWrapper = (props = {}) => {
    return mount(Match, {
      props: {
        match: mockMatch,
        ...props
      },
      global: { plugins: [i18n, createPinia()] }
    })
  }

  it('應正確渲染標題', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('h1').text()).toBe('配對大廳')
  })

  it('應正確渲染配對按鈕', () => {
    const wrapper = createWrapper()
    const matchButton = wrapper.find('button')
    expect(matchButton.exists()).toBe(true)
    expect(matchButton.text()).toBe('開始配對')
  })

  it('點擊配對按鈕應觸發事件', async () => {
    const wrapper = createWrapper()
    const matchButton = wrapper.find('button')
    
    await matchButton.trigger('click')
    await nextTick()
    
    const emitted = wrapper.emitted('match')
    expect(emitted).toBeTruthy()
  })

  it('配對中應顯示等待狀態', () => {
    const wrapper = createWrapper({
      match: { ...mockMatch, status: 'matching' }
    })
    expect(wrapper.text()).toContain('等待配對中...')
  })

  it('配對成功應顯示對方信息', () => {
    const partner = {
      id: 2,
      username: 'partner',
      avatar: 'partner-avatar.jpg'
    }
    const wrapper = createWrapper({
      match: { ...mockMatch, status: 'matched', partner }
    })
    expect(wrapper.text()).toContain(partner.username)
  })

  it('配對失敗應顯示錯誤信息', () => {
    const wrapper = createWrapper({
      match: { ...mockMatch, status: 'failed' }
    })
    expect(wrapper.text()).toContain('配對失敗')
  })
}) 