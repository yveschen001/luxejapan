<template>
  <div class="card">
    <div v-if="title" class="card-title">{{ title }}</div>
    <slot />
    <div v-if="footer" class="card-footer">{{ footer }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps({
  title: String,
  footer: String,
});
</script>

<style scoped>
.card {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  margin-bottom: 1rem;
}
.card-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.card-footer {
  margin-top: 1rem;
  color: #888;
  font-size: 0.95rem;
}
</style> 