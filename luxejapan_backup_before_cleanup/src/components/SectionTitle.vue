<template>
  <div class="section-title">
    <h2 class="section-title__main"><slot name="main" /></h2>
    <div v-if="$slots.sub" class="section-title__sub"><slot name="sub" /></div>
  </div>
</template>

<style scoped>
.section-title {
  text-align: center;
  margin: 0 auto 2rem auto;
  max-width: 900px;
}
.section-title__main {
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
  letter-spacing: 0.04em;
}
.section-title__sub {
  font-size: 1.1rem;
  color: var(--color-text-light);
  margin-top: 0.2rem;
}
</style> 