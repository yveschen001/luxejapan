<template>
  <main id="main-content" tabindex="-1">
    <SectionContainer>
      <SectionTitle>
        <template #main>{{ $t('terms.title') }}</template>
      </SectionTitle>
      <div class="terms-content">
        <div class="terms-intro">
          <span v-if="$t('terms.intro').includes('Luxe Japan Elite Escorts')">
            <router-link :to="contactPath" class="terms__brand-link" aria-label="$t('nav.contact')">
              <BrandLogo size="1em" />
            </router-link>
            {{ $t('terms.intro').split('Luxe Japan Elite Escorts')[0] }}
            <router-link :to="contactPath" class="terms__brand-link" aria-label="$t('nav.contact')">
              <BrandLogo size="1em" />
            </router-link>
            {{ $t('terms.intro').split('Luxe Japan Elite Escorts')[1] }}
          </span>
          <span v-else>
            <router-link :to="contactPath" class="terms__brand-link" aria-label="$t('nav.contact')">
              <BrandLogo size="1em" />
            </router-link>
            {{ $t('terms.intro') }}
          </span>
        </div>
        <div class="terms-sections">
          <div v-for="(section, index) in tm('terms.sections')" :key="index" class="terms-section">
            <h3 class="section-title">{{ section.title }}</h3>
            <p class="section-content">{{ section.content }}</p>
          </div>
        </div>
        <div class="terms-effect">{{ $t('terms.effect') }}</div>
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
import BrandLogo from '@/components/BrandLogo.vue';
import { useLocalePath } from '@/utils/i18n';

const { tm } = useI18n();
const route = useRoute();
const { localePath } = useLocalePath();
const contactPath = localePath('/contact');

useSeo({
  title: 'terms.title',
  description: 'terms.intro',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/terms`,
    'en': `/en/terms`
  }
});
</script>

<style scoped>
.terms-content {
  font-size: 1.08rem;
  line-height: 1.7;
  color: var(--color-text);
  margin-top: 1.5rem;
}
.terms-intro {
  margin-bottom: 1.5em;
}
.terms-sections {
  margin: 2em 0;
}
.terms-section {
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
.terms-effect {
  margin-top: 2em;
  font-style: italic;
  color: var(--color-text-light);
}
.terms__brand-link {
  display: inline-block;
  vertical-align: middle;
  text-decoration: none;
}
</style> 