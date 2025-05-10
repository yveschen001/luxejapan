<template>
  <div>
    <PageHero :title="'404'" bg="about-bg.jpg" />
    <SectionContainer>
      <h2 class="error404-title">{{ t('error404.notFoundTitle') }}</h2>
      <p class="error404-desc">{{ t('error404.notFoundDesc') }}</p>
      <router-link :to="contactPath" class="text-link error404-link">{{ t('error404.contactUs') }}</router-link>
    </SectionContainer>
  </div>
</template>

<script setup lang="ts">
import PageHero from '@/components/PageHero.vue'
import SectionContainer from '@/components/SectionContainer.vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '@/utils/i18n'

const { t } = useI18n()
const { localePath } = useLocalePath()
const contactPath = localePath('/contact')
</script>

<style scoped>
.error404-title {
  font-size: 2rem;
  color: var(--color-accent);
  font-family: var(--font-primary);
  margin-bottom: 1.2rem;
  text-align: center;
}
.error404-desc {
  color: var(--color-text);
  font-size: 1.15rem;
  line-height: 1.8;
  text-align: center;
  margin-bottom: 1.5rem;
}
.error404-link {
  display: block;
  margin: 0 auto;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-accent);
  text-decoration: underline;
  transition: color 0.2s;
}
.error404-link:hover {
  color: var(--color-primary);
}
</style> 