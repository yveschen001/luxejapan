<template>
  <button
    :class="[
      'telesoul-button',
      `telesoul-button--${variant}`,
      { 'telesoul-button--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  label?: string
  variant?: 'primary' | 'secondary' | 'text'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.telesoul-button {
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
}

.telesoul-button--primary {
  background-color: #4B0082;
  color: #FFFFFF;
}

.telesoul-button--primary:hover:not(.telesoul-button--disabled) {
  background-color: #5B1A92;
  box-shadow: 0 2px 8px rgba(75, 0, 130, 0.2);
}

.telesoul-button--secondary {
  background-color: #9370DB;
  color: #FFFFFF;
}

.telesoul-button--secondary:hover:not(.telesoul-button--disabled) {
  background-color: #A38AE0;
  box-shadow: 0 2px 8px rgba(147, 112, 219, 0.2);
}

.telesoul-button--text {
  background-color: transparent;
  color: #4B0082;
}

.telesoul-button--text:hover:not(.telesoul-button--disabled) {
  color: #5B1A92;
  background-color: rgba(75, 0, 130, 0.05);
}

.telesoul-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.telesoul-button:active:not(.telesoul-button--disabled) {
  transform: scale(0.98);
}
</style> 