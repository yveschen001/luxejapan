<template>
  <PageHero :title="$t('testimonials.title')" bg="assets/images/testimonials-bg.jpg" />
  <section class="testimonials">
    <SectionContainer>
      <SectionTitle class="testimonials-subtitle">
        <template #sub>{{ $t('testimonials.subtitle') }}</template>
      </SectionTitle>
      <div class="testimonials-list">
        <TestimonialCard
          v-for="testimonial in testimonials"
          :key="testimonial.nickname"
          :testimonial="testimonial"
        />
      </div>
    </SectionContainer>
  </section>
</template>

<script setup>
import SectionContainer from '@/components/SectionContainer.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import PageHero from '@/components/PageHero.vue';
import TestimonialCard from '@/components/TestimonialCard.vue';
import { useSeo } from '@/utils/useSeo';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { locale } = useI18n();
const { tm } = useI18n();
const route = useRoute();

useSeo({
  title: 'testimonials.title',
  description: 'testimonials.subtitle',
  image: 'assets/images/testimonials-bg.jpg',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/testimonials`,
    'en': `/en/testimonials`
  }
});

const testimonials = tm('testimonials.list');
</script>

<style scoped>
.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
  margin-top: var(--spacing-xl);
  max-width: 700px;
}
.testimonials-subtitle {
  text-align: center;
  margin-bottom: 1.5rem;
}
@media (max-width: 900px) {
  .testimonials-list {
    max-width: 100%;
    gap: 1.2rem;
  }
}
</style> 