import { mount } from '@vue/test-utils'
import Withdraw from './Withdraw.vue'
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

describe('Withdraw.vue', () => {
  const mockHistory = [
    {
      id: 1,
      amount: 100,
      status: 'completed',
      createdAt: '2024-03-21T10:00:00Z'
    },
    {
      id: 2,
      amount: 200,
      status: 'pending',
      createdAt: '2024-03-21T11:00:00Z'
    }
  ]

  const createWrapper = (props = {}) => {
    return mount(Withdraw, {
      props: {
        history: mockHistory,
        ...props
      },
      global: { plugins: [i18n, createPinia()] }
    })
  }

  it('正確渲染標題', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('提領')
  })

  it('正確渲染提領表單', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('正確顯示歷史記錄', () => {
    const wrapper = createWrapper()
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
    expect(table.findAll('tr').length).toBe(mockHistory.length + 1) // +1 for header
  })

  it('正確處理提領提交', async () => {
    const wrapper = createWrapper()
    const amount = 500
    
    await wrapper.find('input[type="number"]').setValue(amount)
    await wrapper.find('form').trigger('submit')
    await nextTick()
    
    expect(wrapper.emitted('withdraw')).toBeTruthy()
    expect(wrapper.emitted('withdraw')[0][0]).toBe(amount)
  })

  it('金額為空時不提交', async () => {
    const wrapper = createWrapper()
    await wrapper.find('form').trigger('submit')
    await nextTick()
    
    expect(wrapper.emitted('withdraw')).toBeFalsy()
  })

  it('金額為負數時不提交', async () => {
    const wrapper = createWrapper()
    await wrapper.find('input[type="number"]').setValue(-100)
    await wrapper.find('form').trigger('submit')
    await nextTick()
    
    expect(wrapper.emitted('withdraw')).toBeFalsy()
  })
}) 