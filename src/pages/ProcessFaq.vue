<template>
  <PageHero :title="$t('processFaq.title')" bg="process-faq-bg.jpg" />
  <SectionContainer>
    <h2>{{ $t('processFaq.title') }}</h2>
    <ol class="process-list">
      <li v-for="(step, i) in tm('processFaq.fullProcess')" :key="'faq-process-'+i">
        <strong>{{ step.title }}</strong><br>
        <template v-if="i === 0">
          {{ step.descPrefix }}
          <a :href="contacts.telegram.url" class="text-link" target="_blank">
            <img src="/icons/telegram.svg" class="icon-inline gold-icon" alt="Telegram" />{{ contacts.telegram.label }}
          </a>
          {{ $t('common.or') }}
          <a :href="contacts.line.url" class="text-link" target="_blank">
            <img src="/icons/line.svg" class="icon-inline gold-icon" alt="LINE" />{{ contacts.line.label }}
          </a>
          {{ step.descSuffix }}
        </template>
        <template v-else>
        {{ step.desc }}
        </template>
      </li>
    </ol>
    <h2>{{ $t('processFaq.faq.title') }}</h2>
    <div class="faq-list">
      <div class="faq-item" v-for="(item, i) in tm('processFaq.fullFaq')" :key="'faq-item-'+i">
        <strong>Q{{ i+1 }}：{{ item.q }}</strong><br>
        <span>A{{ i+1 }}：<br>
          <template v-if="i === 0">
            {{ $t('processFaq.faq.a1Prefix') }}
            <a :href="contacts.telegram.url" class="text-link" target="_blank">
              <img src="/icons/telegram.svg" class="icon-inline gold-icon" alt="Telegram" />{{ contacts.telegram.label }}
            </a>
            {{ $t('common.and') }}
            <a :href="contacts.line.url" class="text-link" target="_blank">
              <img src="/icons/line.svg" class="icon-inline gold-icon" alt="LINE" />{{ contacts.line.label }}
            </a>
            {{ $t('processFaq.faq.a1Suffix') }}
          </template>
          <template v-else>
            {{ item.a }}
          </template>
        </span>
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
import contacts from '@/config/contacts';

const { locale } = useI18n();
const { tm } = useI18n();
const route = useRoute();

useSeo({
  title: 'processFaq.title',
  description: 'processFaq.subtitle',
  image: 'process-faq-bg.jpg',
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
.text-link {
  color: var(--color-accent) !important;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}
.text-link:hover {
  color: var(--color-primary) !important;
}
.icon-inline {
  width: 1.1em;
  height: 1.1em;
  vertical-align: middle;
  margin-right: 0.25em;
  margin-bottom: 0.1em;
  color: var(--color-accent) !important;
}
.gold-icon {
  filter: brightness(0) saturate(100%) invert(83%) sepia(31%) saturate(638%) hue-rotate(358deg) brightness(103%) contrast(87%);
}
</style> 