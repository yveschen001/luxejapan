<template>
  <img
    :src="src"
    :alt="alt"
    :aria-label="ariaLabel || alt"
    :class="['telesoul-avatar', sizeClass]"
    loading="lazy"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue'

interface Props {
  src?: string
  size?: number | string
  alt?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  size: 40,
  alt: 'Avatar',
  ariaLabel: ''
})

const fallback = ref('https://ui-avatars.com/api/?name=U&background=9370DB&color=fff')

const onError = (e: Event) => {
  (e.target as HTMLImageElement).src = fallback.value
}

const sizeClass = computed(() => {
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: s,
    height: s
  }
})
</script>

<style scoped>
.telesoul-avatar {
  border-radius: 50%;
  object-fit: cover;
  display: inline-block;
  background: #F5F5F5;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
</style> 