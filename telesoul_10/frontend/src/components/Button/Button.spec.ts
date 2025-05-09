import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import { createI18n } from 'vue-i18n'
import zh from '../../i18n/locales/zh.json'
import en from '../../i18n/locales/en.json'
import { createPinia } from 'pinia'

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: { zh, en },
})

describe('Button', () => {
  const createWrapper = (props = {}) => {
    return mount(Button, {
      props,
      global: { plugins: [i18n, createPinia()] }
    })
  }

  it('正確渲染默認狀態', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('btn-primary')
  })

  it('正確渲染不同變體', () => {
    const variants = ['primary', 'secondary', 'text']
    variants.forEach(variant => {
      const wrapper = createWrapper({ variant })
      expect(wrapper.classes()).toContain(`btn-${variant}`)
    })
  })

  it('正確處理禁用狀態', () => {
    const wrapper = createWrapper({ disabled: true })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('btn-disabled')
  })

  it('正確顯示標籤文字', () => {
    const label = '測試按鈕'
    const wrapper = createWrapper({ label })
    expect(wrapper.text()).toContain(label)
  })

  it('正確觸發點擊事件', async () => {
    const wrapper = createWrapper()
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('禁用時不觸發點擊事件', async () => {
    const wrapper = createWrapper({ disabled: true })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('加載狀態時禁用按鈕', () => {
    const wrapper = createWrapper({ loading: true })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('btn-loading')
  })

  it('正確顯示圖標', () => {
    const icon = 'test-icon'
    const wrapper = createWrapper({ icon })
    expect(wrapper.html()).toContain(icon)
  })

  it('正確處理自定義類名', () => {
    const customClass = 'custom-class'
    const wrapper = createWrapper({ class: customClass })
    expect(wrapper.classes()).toContain(customClass)
  })
}) 