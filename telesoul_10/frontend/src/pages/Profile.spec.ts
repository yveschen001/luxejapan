import { mount } from '@vue/test-utils'
import Profile from './Profile.vue'
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

describe('Profile.vue', () => {
  const mockUser = {
    id: 1,
    username: 'testuser',
    avatar: 'test-avatar.jpg',
    email: 'test@example.com',
    phone: '1234567890'
  }

  const createWrapper = (props = {}) => {
    return mount(Profile, {
      props: {
        user: mockUser,
        ...props
      },
      global: { plugins: [i18n, createPinia()] }
    })
  }

  it('正確渲染標題', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('個人資料')
  })

  it('正確顯示用戶信息', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain(mockUser.username)
    expect(wrapper.text()).toContain(mockUser.email)
    expect(wrapper.text()).toContain(mockUser.phone)
  })

  it('正確渲染 Avatar 組件', () => {
    const wrapper = createWrapper()
    const avatar = wrapper.findComponent({ name: 'Avatar' })
    expect(avatar.exists()).toBe(true)
    expect(avatar.props('src')).toBe(mockUser.avatar)
  })

  it('正確處理編輯模式', async () => {
    const wrapper = createWrapper()
    const editButton = wrapper.find('button.edit-button')
    
    await editButton.trigger('click')
    await nextTick()
    
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('button.save-button').exists()).toBe(true)
  })

  it('正確處理保存操作', async () => {
    const wrapper = createWrapper()
    const editButton = wrapper.find('button.edit-button')
    
    await editButton.trigger('click')
    await nextTick()
    
    const newUsername = 'newusername'
    await wrapper.find('input[type="text"]').setValue(newUsername)
    await wrapper.find('button.save-button').trigger('click')
    await nextTick()
    
    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')[0][0]).toEqual({
      ...mockUser,
      username: newUsername
    })
  })
}) 