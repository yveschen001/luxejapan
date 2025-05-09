<template>
  <img :src="src" :alt="alt" :class="['avatar', sizeClass]" />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
const props = defineProps({
  src: { type: String, required: true },
  size: { type: [Number, String], default: 40 },
  alt: { type: String, default: '' },
});
const sizeClass = computed(() => `avatar-${props.size}`);
</script>

<style scoped>
.avatar {
  border-radius: 50%;
  object-fit: cover;
  display: inline-block;
  background: #f5f5f5;
}
.avatar-40 {
  width: 40px;
  height: 40px;
}
.avatar-64 {
  width: 64px;
  height: 64px;
}
.avatar-80 {
  width: 80px;
  height: 80px;
}
</style> 