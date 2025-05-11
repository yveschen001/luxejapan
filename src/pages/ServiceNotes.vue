<template>
  <PageHero :title="$t('serviceNotes.title')" :bg="base + 'images/service-notes-bg.jpg'" />
  <section class="service-notes">
    <SectionDivider />
    <SectionContainer>
      <SectionTitle>
        <template #main>{{ $t('serviceNotes.title') }}</template>
        <template #sub>{{ $t('serviceNotes.subtitle') }}</template>
      </SectionTitle>
      <ul class="notes-list">
        <li>{{ $t('serviceNotes.note1') }}</li>
        <li>{{ $t('serviceNotes.note2') }}</li>
        <li>{{ $t('serviceNotes.note3') }}</li>
        <li>{{ $t('serviceNotes.note4') }}</li>
      </ul>
      <h3 class="privacy-title">{{ $t('serviceNotes.privacyTitle') }}</h3>
      <p class="privacy-desc">{{ $t('serviceNotes.privacyDesc') }}</p>
    </SectionContainer>
  </section>
</template>

<script setup>
import SectionDivider from '@/components/SectionDivider.vue';
import SectionContainer from '@/components/SectionContainer.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import PageHero from '@/components/PageHero.vue';
import { useSeo } from '@/utils/useSeo';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { locale } = useI18n();
const route = useRoute();

useSeo({
  title: 'serviceNotes.title',
  description: 'serviceNotes.subtitle',
  image: base + 'images/service-notes-bg.jpg',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/service-notes`,
    'en': `/en/service-notes`
  }
});
</script>

<style scoped>
.notes-list {
  margin: 2rem auto 2.5rem auto;
  max-width: 700px;
  font-size: 1.08rem;
  color: var(--color-text);
  line-height: 1.7;
  padding-left: 1.2em;
}
.privacy-title {
  font-size: 1.2rem;
  color: var(--color-accent);
  margin-top: 2.5rem;
  margin-bottom: 0.5rem;
}
.privacy-desc {
  color: var(--color-text-light);
  font-size: 1rem;
}
</style> 