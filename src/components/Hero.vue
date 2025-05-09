<template>
  <section class="hero" role="banner">
    <div class="hero__content">
      <h1 class="hero__title">
        <BrandLogo size="3.5rem" />
        <span style="display:none">{{ $t('hero.title') }}</span>
      </h1>
      <p class="hero__subtitle">{{ $t('hero.subtitle') }}</p>
      <button class="btn btn-primary" @click="scrollToIntro">{{ $t('hero.cta') }}</button>
    </div>
  </section>
</template>

<script setup>
import BrandLogo from '@/components/BrandLogo.vue';
const scrollToIntro = () => {
  const el = document.getElementById('intro');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
// 仅需i18n
</script>

<style scoped>
.hero {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, var(--color-background), var(--color-primary-light));
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url('/images/hero-bg.jpg') center/cover;
  opacity: 0.13;
}
.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
}
.hero__title {
  font-family: var(--font-primary);
  font-size: 2.5rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
.hero__subtitle {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 600px) {
  .hero {
    min-height: 320px;
  }
  .hero__title {
    font-size: 2.5rem;
  }
}
</style> 