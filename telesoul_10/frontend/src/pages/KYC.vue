<template>
  <div class="telesoul-container py-12">
    <div class="telesoul-card">
      <h2 class="text-2xl font-bold mb-4">{{ $t('kyc.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">{{ $t('kyc.desc') }}</p>
      <button class="telesoul-button telesoul-button--primary">{{ $t('kyc.start') }}</button>
      <div class="mt-8 text-center text-gray-400">（KYC 進度與結果占位）</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const kycStatus = ref('')
const loading = ref(false)
const error = ref('')

const applyKyc = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/kyc/apply', { method: 'POST', body: JSON.stringify({ userId: 1, provider: 'sumsub' }) })
    const data = await res.json()
    if (res.ok && data.code === 0) {
      kycStatus.value = data.data.status
    } else {
      error.value = data.message || 'KYC 申請失敗'
    }
  } catch (e) {
    error.value = 'KYC 申請失敗'
  } finally {
    loading.value = false
  }
}

const fetchKycStatus = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/kyc/status?userId=1')
    const data = await res.json()
    if (res.ok && data.code === 0) {
      kycStatus.value = data.data.status
    } else {
      error.value = data.message || '查詢 KYC 狀態失敗'
    }
  } catch (e) {
    error.value = '查詢 KYC 狀態失敗'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page.kyc {
  padding: 2rem;
}
</style> 