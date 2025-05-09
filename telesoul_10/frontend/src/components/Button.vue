<template>
  <button :class="['btn', variantClass]" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
const props = defineProps({
  variant: { type: String, default: 'primary' },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(['click']);
const variantClass = computed(() => {
  return props.variant === 'primary' ? 'bg-primary text-white' : 'bg-secondary text-black';
});
function onClick(e: Event) {
  if (!props.disabled) emit('click', e);
}
</script>

<style scoped>
.btn {
  height: 40px;
  border-radius: 8px;
  padding: 0 1.5rem;
  font-weight: 600;
  transition: background 0.2s, box-shadow 0.2s;
}
.bg-primary {
  background: #4B0082;
}
.bg-secondary {
  background: #FFD700;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 