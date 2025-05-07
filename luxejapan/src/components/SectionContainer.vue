<template>
  <section :class="['section-container', { 'section-container--alt': alt }]">
    <slot />
  </section>
</template>

<script setup>
defineProps({
  alt: Boolean // 可选：切换不同背景色
})
</script>

<style scoped>
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  background: var(--color-background);
  border-radius: 1.5rem;
  box-shadow: 0 2px 8px rgba(45,27,77,0.04);
}
.section-container--alt {
  background: var(--color-surface);
}
</style> 