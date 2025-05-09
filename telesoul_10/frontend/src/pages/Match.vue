<template>
  <div class="telesoul-container py-12">
    <div class="telesoul-card">
      <h2 class="text-2xl font-bold mb-4">配对大厅</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">在这里你可以发起语音/视频配对，等待系统为你智能匹配合适的对象。</p>
      <button class="telesoul-button telesoul-button--primary" @click="startMatch">开始匹配</button>
      <div class="mt-8 text-center text-gray-400">（匹配结果与房间信息占位）</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const roomId = ref('')
const loading = ref(false)
const error = ref('')

const startMatch = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/match', { method: 'POST' })
    const data = await res.json()
    if (res.ok && data.code === 0) {
      roomId.value = data.data.roomId
    } else {
      error.value = data.message || '匹配失敗'
    }
  } catch (e) {
    error.value = '匹配失敗'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page.match {
  padding: 2rem;
}
</style> 