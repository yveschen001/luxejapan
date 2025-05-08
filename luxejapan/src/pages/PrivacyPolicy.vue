<template>
  <main id="main-content" tabindex="-1">
    <SectionContainer>
      <SectionTitle>
        <template #main>{{ $t('privacy.title') }}</template>
      </SectionTitle>
      <div class="privacy-content">
        <div class="privacy-intro">{{ $t('privacy.intro') }}</div>
        <div class="privacy-sections">
          <div v-for="(section, index) in tm('privacy.sections')" :key="index" class="privacy-section">
            <h3 class="section-title">{{ section.title }}</h3>
            <p class="section-content">{{ section.content }}</p>
          </div>
        </div>
        <div class="privacy-effect">{{ $t('privacy.effect') }}</div>
      </div>
    </SectionContainer>
  </main>
</template>

<script setup>
import SectionContainer from '@/components/SectionContainer.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import { useSeo } from '@/utils/useSeo';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import contacts from '@/config/contacts';

const { tm } = useI18n();
const route = useRoute();

useSeo({
  title: 'privacy.title',
  description: 'privacy.intro',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/privacy`,
    'en': `/en/privacy`
  }
});
</script>

<style scoped>
.privacy-content {
  font-size: 1.08rem;
  line-height: 1.7;
  color: var(--color-text);
  margin-top: 1.5rem;
}
.privacy-intro {
  margin-bottom: 1.5em;
}
.privacy-sections {
  margin: 2em 0;
}
.privacy-section {
  margin-bottom: 2em;
}
.section-title {
  color: var(--color-accent);
  font-size: 1.2em;
  margin-bottom: 0.8em;
  font-weight: 600;
}
.section-content {
  margin-bottom: 1em;
}
.privacy-effect {
  margin-top: 2em;
  font-style: italic;
  color: var(--color-text-light);
}
</style> 