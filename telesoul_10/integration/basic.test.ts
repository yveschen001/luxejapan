import { describe, it, expect } from 'vitest'
import axios from 'axios'

describe('基本集成測試', () => {
  it('健康檢查端點應返回 200', async () => {
    try {
      const response = await axios.get('http://localhost:3000/health')
      expect(response.status).toBe(200)
    } catch (error) {
      console.error('健康檢查失敗:', error)
      throw error
    }
  })

  it('API 版本端點應返回正確版本', async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/version')
      expect(response.status).toBe(200)
      expect(response.data.version).toBeDefined()
    } catch (error) {
      console.error('版本檢查失敗:', error)
      throw error
    }
  })

  it('用戶資料端點應返回 200 並包含必要欄位', async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/profile')
      expect(response.status).toBe(200)
      expect(response.data).toHaveProperty('id')
      expect(response.data).toHaveProperty('username')
    } catch (error) {
      console.error('用戶資料查詢失敗:', error)
      throw error
    }
  })
})
