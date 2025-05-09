<template>
  <div class="telesoul-container py-12">
    <div class="telesoul-card">
      <h2 class="text-2xl font-bold mb-4">USDT 提领</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">你可以在此发起 USDT 提领申请，系统将自动或人工审核。</p>
      <input v-model="amount" type="number" min="1" placeholder="请输入提领金额（USDT）" class="telesoul-input mb-4" />
      <button class="telesoul-button telesoul-button--primary" :disabled="loading" @click="applyWithdraw">{{ loading ? '申请中...' : '发起提领' }}</button>
      <div class="mt-8 text-center text-gray-400">
        <div v-if="withdrawals.length === 0">暂无提领记录</div>
        <div v-else>
          <h3 class="font-semibold mb-2">提领历史与审核进度</h3>
          <table class="w-full text-sm">
            <thead>
              <tr>
                <th>金额</th>
                <th>状态</th>
                <th>申请时间</th>
                <th>更新时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in withdrawals" :key="w.id">
                <td>{{ w.amount_usd }}</td>
                <td>{{ w.status }}</td>
                <td>{{ w.created_at }}</td>
                <td>{{ w.updated_at }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
      <div v-if="success" class="text-green-500 mt-4">{{ success }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const amount = ref(0)
const loading = ref(false)
const error = ref('')
const success = ref('')
const withdrawals = ref<any[]>([])

const fetchWithdrawals = async () => {
  try {
    const res = await axios.get('/api/withdraw/status', { params: { userId: 1 } })
    if (res.data.code === 0) {
      withdrawals.value = res.data.data
    } else {
      error.value = res.data.message || '提领记录获取失败'
    }
  } catch (e) {
    error.value = '提领记录获取失败'
  }
}

const applyWithdraw = async () => {
  error.value = ''
  success.value = ''
  if (!amount.value || amount.value <= 0) {
    error.value = '请输入有效的提领金额'
    return
  }
  loading.value = true
  try {
    const res = await axios.post('/api/withdraw/apply', { userId: 1, amount_usd: amount.value })
    if (res.data.code === 0) {
      success.value = '提领申请已提交，等待审核'
      fetchWithdrawals()
    } else {
      error.value = res.data.message || '提领申请失败'
    }
  } catch (e) {
    error.value = '提领申请失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWithdrawals()
})
</script>

<style scoped>
.page.withdraw {
  padding: 2rem;
}
</style> 