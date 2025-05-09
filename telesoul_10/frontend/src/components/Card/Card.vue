<template>
  <div class="telesoul-card" :aria-label="ariaLabel">
    <div v-if="title" class="telesoul-card-title">{{ title }}</div>
    <div class="telesoul-card-content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="telesoul-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  title?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  ariaLabel: ''
})
</script>

<style scoped>
.telesoul-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.telesoul-card-title {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 12px;
  color: #333;
}
.telesoul-card-content {
  flex: 1 1 auto;
}
.telesoul-card-footer {
  margin-top: 16px;
  border-top: 1px solid #F5F5F5;
  padding-top: 12px;
  color: #666;
  font-size: 14px;
}
</style> 