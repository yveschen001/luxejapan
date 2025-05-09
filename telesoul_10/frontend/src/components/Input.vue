<template>
  <div class="input-wrapper">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :class="['input', error ? 'input-error' : '']"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-if="error" class="input-error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  modelValue: String,
  placeholder: String,
  error: String,
  disabled: Boolean,
  type: { type: String, default: 'text' },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.input {
  height: 40px;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  padding: 0 1rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.input:focus {
  border-color: #4B0082;
}
.input-error {
  border-color: #E53935;
}
.input-error-message {
  color: #E53935;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
</style> 