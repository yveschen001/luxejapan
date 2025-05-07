<template>
  <section class="about">
    <h1>{{ $t('about.title') }}</h1>
    <SectionDivider />
    <div class="about__section">
      <h2>{{ $t('about.philosophyTitle') }}</h2>
      <p>{{ $t('about.philosophyDesc') }}</p>
    </div>
    <div class="about__section">
      <h2>{{ $t('about.commitmentTitle') }}</h2>
      <p>{{ $t('about.commitmentDesc') }}</p>
    </div>
  </section>
</template>

<script setup>
import SectionDivider from '@/components/SectionDivider.vue';
// 仅需i18n
</script>

<style scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}
.about__section {
  margin-bottom: var(--spacing-xl);
}
</style> 