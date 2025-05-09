<template>
  <div class="telesoul-container py-12">
    <div class="telesoul-card">
      <h2 class="text-2xl font-bold mb-4">个人中心</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">管理你的个人信息、账号绑定、余额与历史记录。</p>
      <div class="flex items-center gap-4 mb-4">
        <Avatar :src="profile?.avatar" :size="64" alt="用户头像" />
        <div>
          <div class="font-semibold">{{ profile?.username }}</div>
          <div class="text-sm text-gray-500">{{ profile?.email }}</div>
        </div>
      </div>
      <div class="mt-8 text-center text-gray-400">（更多个人信息与操作入口占位）</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar/Avatar.vue'
import { ref, onMounted } from 'vue'

const profile = ref(null)
const loading = ref(false)
const error = ref('')

const fetchProfile = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/user/profile?userId=1')
    const data = await res.json()
    if (res.ok && data.code === 0) {
      profile.value = data.data
    } else {
      error.value = data.message || '獲取個人資料失敗'
    }
  } catch (e) {
    error.value = '獲取個人資料失敗'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.page.profile {
  padding: 2rem;
}
</style> 