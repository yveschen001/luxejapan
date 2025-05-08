<template>
  <PageHero :title="$t('processFaq.title')" bg="/images/process-faq-bg.jpg" />
  <SectionContainer>
    <h2>{{ $t('processFaq.title') }}</h2>
    <ol class="process-list">
      <li v-for="(step, i) in tm('processFaq.fullProcess')" :key="'faq-process-'+i">
        <strong>{{ step.title }}</strong><br>
        {{ step.desc }}
      </li>
    </ol>
    <h2>{{ $t('processFaq.faq.title') }}</h2>
    <div class="faq-list">
      <div class="faq-item" v-for="(item, i) in tm('processFaq.fullFaq')" :key="'faq-item-'+i">
        <strong>Q{{ i+1 }}：{{ item.q }}</strong><br>
        <span>A{{ i+1 }}：<br>{{ item.a }}</span>
      </div>
    </div>
  </SectionContainer>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue';
import SectionContainer from '@/components/SectionContainer.vue';
import { useSeo } from '@/utils/useSeo';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { locale } = useI18n();
const { tm } = useI18n();
const route = useRoute();

useSeo({
  title: 'processFaq.title',
  description: 'processFaq.subtitle',
  image: '/images/process-faq-bg.jpg',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/process-faq`,
    'en': `/en/process-faq`
  }
});
</script>

<style scoped>
.process-list {
  margin: 2rem 0 2.5rem 1.2em;
  padding: 0;
  list-style: decimal;
  color: var(--color-text);
  font-size: 1.08rem;
  line-height: 1.8;
}
.faq-list {
  margin-top: 2.5rem;
}
.faq-item {
  margin-bottom: 1.5rem;
  color: var(--color-text);
  font-size: 1.08rem;
  line-height: 1.7;
}
h2 {
  font-size: 2rem;
  color: var(--color-accent);
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style> 