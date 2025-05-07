<template>
  <section class="services-page">
    <h1>{{ $t('services.title') }}</h1>
    <SectionDivider />
    <div class="services-page__section">
      <h2>{{ $t('services.inhomeTitle') }}</h2>
      <p>{{ $t('services.inhomeDesc') }}</p>
    </div>
    <div class="services-page__section">
      <h2>{{ $t('services.companionTitle') }}</h2>
      <p>{{ $t('services.companionDesc') }}</p>
    </div>
    <div class="services-page__section">
      <h2>{{ $t('services.clubTitle') }}</h2>
      <p>{{ $t('services.clubDesc') }}</p>
    </div>
  </section>
</template>

<script setup>
import SectionDivider from '@/components/SectionDivider.vue';
// 仅需i18n
</script>

<style scoped>
.services-page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}
.services-page__section {
  margin-bottom: var(--spacing-xl);
}
</style> 