<template>
  <div class="telesoul-container py-12">
    <div class="mx-auto max-w-md">
      <div class="telesoul-card">
        <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          登录账号
        </h2>

        <form class="mt-10 space-y-6" @submit.prevent="handleSubmit">
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

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                记住我
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary hover:text-primary-hover">
                忘记密码？
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
          还没有账号？
          <router-link
            to="/register"
            class="font-medium leading-6 text-primary hover:text-primary-hover"
          >
            立即注册
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    await authStore.login(email.value, password.value)
    
    const redirectPath = route.query.redirect as string
    router.push(redirectPath || '/')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page.login {
  max-width: 320px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
form > * + * {
  margin-top: 1rem;
}
</style> 