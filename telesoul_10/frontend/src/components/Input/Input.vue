<template>
  <div class="telesoul-input-wrapper">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="ariaLabel || placeholder"
      :class="[
        'telesoul-input',
        { 'telesoul-input--error': error, 'telesoul-input--disabled': disabled }
      ]"
      @input="onInput"
      @change="$emit('change', $event)"
    />
    <p v-if="error" class="telesoul-input-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  error: '',
  disabled: false,
  ariaLabel: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', event: Event): void
}>()

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
}
</script>

<style scoped>
.telesoul-input-wrapper {
  display: flex;
  flex-direction: column;
}
.telesoul-input {
  height: 40px;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s;
  outline: none;
  background: #fff;
}
.telesoul-input:focus {
  border-color: #4B0082;
}
.telesoul-input--error {
  border-color: #E53935;
}
.telesoul-input--disabled {
  background: #F5F5F5;
  color: #999;
  cursor: not-allowed;
}
.telesoul-input-error {
  color: #E53935;
  font-size: 12px;
  margin-top: 4px;
}
</style> 