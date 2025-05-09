<template>
  <Teleport to="body">
    <transition name="telesoul-modal-fade">
      <div v-if="isOpen" class="telesoul-modal-overlay" @click.self="onClose">
        <div :class="['telesoul-modal', sizeClass]" role="dialog" aria-modal="true">
          <div v-if="title" class="telesoul-modal-title">{{ title }}</div>
          <button class="telesoul-modal-close" @click="onClose" aria-label="Close">×</button>
          <div class="telesoul-modal-content">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const onClose = () => {
  emit('close')
}

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'telesoul-modal-sm'
    case 'lg':
      return 'telesoul-modal-lg'
    default:
      return 'telesoul-modal-md'
  }
})
</script>

<style scoped>
.telesoul-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.telesoul-modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 24px 24px 16px 24px;
  min-width: 320px;
  max-width: 90vw;
  position: relative;
  animation: telesoul-modal-in 0.2s ease;
}
.telesoul-modal-sm { width: 320px; }
.telesoul-modal-md { width: 480px; }
.telesoul-modal-lg { width: 720px; }
.telesoul-modal-title {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
}
.telesoul-modal-content {
  font-size: 16px;
  color: #333;
}
.telesoul-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;
}
.telesoul-modal-close:hover {
  color: #4B0082;
}
.telesoul-modal-fade-enter-active,
.telesoul-modal-fade-leave-active {
  transition: opacity 0.2s;
}
.telesoul-modal-fade-enter-from,
.telesoul-modal-fade-leave-to {
  opacity: 0;
}
@keyframes telesoul-modal-in {
  from { transform: scale(0.98) translateY(16px); opacity: 0.7; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
</style> 