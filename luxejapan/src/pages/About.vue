<template>
  <PageHero :title="$t('about.title')" bg="/images/about-bg.jpg" />
  <main id="main-content" tabindex="-1">
    <h1 class="visually-hidden">{{ $t('about.title') }}</h1>
    <p v-for="(p, i) in tm('about.story.paragraphs')" :key="'about-p'+i">
      <span v-if="p.includes('{brand}')">
        {{ p.split('{brand}')[0] }}<BrandLogo size="1em" />{{ p.split('{brand}')[1] }}
      </span>
      <span v-else v-html="p"></span>
    </p>
    <ul>
      <li v-for="(item, i) in tm('about.story.list')" :key="'about-li'+i">{{ item }}</li>
    </ul>
    <h2>{{ $t('about.story.experienceTitle') }}</h2>
    <p>
      <span v-if="$t('about.story.experienceParagraph').includes('{brand}')">
        {{ $t('about.story.experienceParagraph').split('{brand}')[0] }}<BrandLogo size="1em" />{{ $t('about.story.experienceParagraph').split('{brand}')[1] }}
      </span>
      <span v-else>{{ $t('about.story.experienceParagraph') }}</span>
    </p>
    <ul>
      <li v-for="(item, i) in tm('about.story.experienceList')" :key="'about-exp-li'+i">{{ item }}</li>
    </ul>
    <p>
      <span v-if="$t('about.story.ending').includes('{brand}')">
        {{ $t('about.story.ending').split('{brand}')[0] }}<BrandLogo size="1em" />{{ $t('about.story.ending').split('{brand}')[1] }}
      </span>
      <span v-else>{{ $t('about.story.ending') }}</span>
    </p>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue';
import { useSeo } from '@/utils/useSeo';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import BrandLogo from '@/components/BrandLogo.vue';

const { locale } = useI18n();
const { tm } = useI18n();
const route = useRoute();

useSeo({
  title: 'about.title',
  description: 'about.philosophyDesc',
  image: '/images/about-bg.jpg',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/about`,
    'en': `/en/about`
  }
});
</script>

<style scoped>
main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
h2 {
  font-size: 2rem;
  color: var(--color-accent);
  margin-top: 2rem;
  margin-bottom: 1rem;
}
p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
ul {
  margin-bottom: 1.5rem;
}
li {
  margin-bottom: 0.5rem;
}
</style> 