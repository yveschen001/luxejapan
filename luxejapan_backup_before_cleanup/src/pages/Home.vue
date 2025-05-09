<template>
  <main id="main-content" tabindex="-1">
    <Hero />
    <SectionContainer id="intro">
      <h2 class="intro-title">{{ $t('home.introTitle') }}</h2>
      <div class="intro-content">
        <p v-for="(p, i) in tm('home.introParagraphs')" :key="'intro-p'+i">
          <span v-if="i===0">
            <router-link :to="localePath('/contact')" class="text-link"><BrandLogo class="intro-brand" size="1em" /></router-link>
          </span>{{ p }}
        </p>
        <ul class="intro-list">
          <li v-for="(item, i) in tm('home.introList')" :key="'intro-li'+i">
            <strong>{{ item.title }}</strong><br>
            {{ item.desc }}
          </li>
        </ul>
        <p style="margin-top:1.2em;">
          <router-link :to="localePath('/contact')" class="text-link"><BrandLogo class="intro-brand" size="1em" /></router-link>
          <router-link :to="localePath('/contact')" class="intro-link">{{ $t('home.introCta') }}</router-link>
        </p>
      </div>
    </SectionContainer>
    <SectionDivider />
    <ServiceCards />
  </main>
</template>

<script setup>
import Hero from '@/components/Hero.vue';
import ServiceCards from '@/components/ServiceCards.vue';
import SectionDivider from '@/components/SectionDivider.vue';
import SectionContainer from '@/components/SectionContainer.vue';
import { useLocalePath } from '@/utils/i18n';
import BrandLogo from '@/components/BrandLogo.vue';
import { useI18n } from 'vue-i18n';

const { localePath } = useLocalePath();
const { tm } = useI18n();
</script>

<style scoped>
main {
  outline: none;
}
:deep(.section-container) {
  text-align: left;
}
.intro-title {
  font-size: 2rem;
  color: var(--color-accent);
  font-family: var(--font-primary);
  margin-bottom: 1.2rem;
}
.intro-content {
  color: var(--color-text);
  font-size: 1.08rem;
  line-height: 1.8;
}
.intro-list {
  margin: 1.2rem 0 1.2rem 1.2em;
  padding: 0;
  list-style: disc;
}
.intro-list li {
  margin-bottom: 1.1em;
}
.intro-brand {
  color: var(--color-accent);
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  letter-spacing: 0.08em;
}
.intro-link {
  color: var(--color-accent);
  text-decoration: underline;
  font-weight: 600;
}
.intro-link:hover {
  color: var(--color-text);
}
.text-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}
.text-link:hover {
  color: var(--color-primary);
}
</style> 