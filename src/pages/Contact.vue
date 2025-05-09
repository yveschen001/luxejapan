<template>
  <PageHero :title="$t('contact.title')" bg="/images/contact-bg.jpg" />
  <section class="contact-page">
    <SectionContainer>
      <SectionTitle>
        <template #sub>{{ $t('contact.subtitle') }}</template>
      </SectionTitle>
      <div class="contact-info">
        <div class="contact-item">
          <img src="/icons/telegram.svg" alt="Telegram" class="contact-icon" />
          <strong>Telegram:</strong> <a :href="contacts.telegram.url" target="_blank">{{ contacts.telegram.label }}</a>
        </div>
        <div class="contact-item">
          <img src="/icons/line.svg" alt="Line" class="contact-icon" />
          <strong>Line:</strong> <a :href="contacts.line.url" target="_blank">{{ contacts.line.label }}</a>
        </div>
        <div class="contact-item">
          <img src="/icons/email.svg" alt="Email" class="contact-icon" />
          <strong>Email:</strong> <a :href="contacts.email.url">{{ contacts.email.label }}</a>
        </div>
        <div class="contact-item">
          <img src="/icons/x.svg" alt="X.com" class="contact-icon" />
          <strong>X.com:</strong> <a :href="contacts.x.url" target="_blank">{{ contacts.x.label }}</a>
        </div>
        <div class="contact-item">
          <img src="/icons/telegram.svg" alt="Telegram Channel" class="contact-icon" />
          <strong>Telegram Channel:</strong> <a :href="contacts.telegramChannel.url" target="_blank">{{ contacts.telegramChannel.label }}</a>
        </div>
      </div>
    </SectionContainer>
  </section>
</template>

<script setup>
import SectionContainer from '@/components/SectionContainer.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import PageHero from '@/components/PageHero.vue';
import { useSeo } from '@/utils/useSeo';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import contacts from '@/config/contacts';

const { locale } = useI18n();
const route = useRoute();

useSeo({
  title: 'contact.title',
  description: 'contact.subtitle',
  image: '/images/contact-bg.jpg',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/contact`,
    'en': `/en/contact`
  }
});
</script>

<style scoped>
.contact-info {
  max-width: 600px;
  margin: 2rem auto 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-size: 1.1rem;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.contact-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  filter: brightness(0) saturate(100%) invert(83%) sepia(31%) saturate(638%) hue-rotate(358deg) brightness(103%) contrast(87%);
}
.contact-item a {
  color: var(--color-accent);
  text-decoration: underline;
}
</style> 