<template>
  <div class="telesoul-container py-12">
    <div class="telesoul-card">
      <h2 class="text-2xl font-bold mb-4">{{ $t('admin.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">{{ $t('admin.desc') }}</p>
      <div class="mt-8 text-center text-gray-400">（{{ $t('admin.placeholder') }}）</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const users = ref([])
const withdrawals = ref([])
const kycRecords = ref([])
const loading = ref(false)
const error = ref('')

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/admin/user/list')
    const data = await res.json()
    if (res.ok && data.code === 0) {
      users.value = data.data
    } else {
      error.value = data.message || '獲取用戶列表失敗'
    }
  } catch (e) {
    error.value = '獲取用戶列表失敗'
  } finally {
    loading.value = false
  }
}

const fetchWithdrawals = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/admin/withdraw/list')
    const data = await res.json()
    if (res.ok && data.code === 0) {
      withdrawals.value = data.data
    } else {
      error.value = data.message || '獲取提領列表失敗'
    }
  } catch (e) {
    error.value = '獲取提領列表失敗'
  } finally {
    loading.value = false
  }
}

const fetchKycRecords = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/admin/kyc/list')
    const data = await res.json()
    if (res.ok && data.code === 0) {
      kycRecords.value = data.data
    } else {
      error.value = data.message || '獲取 KYC 列表失敗'
    }
  } catch (e) {
    error.value = '獲取 KYC 列表失敗'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
  fetchWithdrawals()
  fetchKycRecords()
})
</script>

<style scoped>
.page.admin {
  padding: 2rem;
}
</style> 