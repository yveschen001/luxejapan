<template>
  <div class="telesoul-container py-12">
    <div class="mx-auto max-w-md">
      <div class="telesoul-card">
        <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          注册账号
        </h2>

        <form class="mt-10 space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="username" class="telesoul-label">用户名</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="telesoul-input w-full"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label for="email" class="telesoul-label">邮箱地址</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="telesoul-input w-full"
              placeholder="请输入邮箱地址"
            />
          </div>

          <div>
            <label for="password" class="telesoul-label">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="telesoul-input w-full"
              placeholder="请输入密码"
            />
          </div>

          <div>
            <label for="confirmPassword" class="telesoul-label">确认密码</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="telesoul-input w-full"
              placeholder="请再次输入密码"
            />
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="agreeTerms"
              type="checkbox"
              required
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              我已阅读并同意
              <a href="#" class="font-medium text-primary hover:text-primary-hover">
                服务条款
              </a>
              和
              <a href="#" class="font-medium text-primary hover:text-primary-hover">
                隐私政策
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading || !agreeTerms"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
          已有账号？
          <router-link
            to="/login"
            class="font-medium leading-6 text-primary hover:text-primary-hover"
          >
            立即登录
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const loading = ref(false)

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }

  try {
    loading.value = true
    // 調用註冊 API
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    if (!res.ok) throw new Error('註冊失敗')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}
</script> 