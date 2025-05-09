import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string | null) => {
    error.value = message
  }

  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      if (!response.ok) {
        throw new Error('登录失败')
      }
      const data = await response.json()
      setToken(data.access_token)
      setUser({ username })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      setLoading(true)
      setError(null)

      // TODO: 实现验证 token API 调用
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      if (!response.ok) {
        throw new Error('验证失败')
      }

      const data = await response.json()
      setUser(data.user)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败')
      logout()
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    checkAuth
  }
}) 