<template>
  <span :class="['brand-logo', customClass]" :style="customStyle">
    <slot>Luxe Japan</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  size: { type: String, default: '2rem' },
  color: { type: String, default: 'var(--color-accent)' },
  weight: { type: [String, Number], default: 600 },
  letterSpacing: { type: String, default: '0.08em' },
  customClass: { type: String, default: '' }
});
const customStyle = computed(() => ({
  fontFamily: `'Playfair Display', serif`,
  fontSize: props.size,
  color: props.color,
  fontWeight: props.weight,
  letterSpacing: props.letterSpacing,
  textShadow: '0 2px 8px rgba(212,175,55,0.08)',
  lineHeight: 1.1,
  display: 'inline-block',
}));
</script>

<style scoped>
.brand-logo {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  text-shadow: 0 2px 8px rgba(212,175,55,0.08);
  line-height: 1.1;
  display: inline-block;
  user-select: none;
}
</style> 