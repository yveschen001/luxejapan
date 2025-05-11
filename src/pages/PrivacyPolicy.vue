<template>
  <main id="main-content" tabindex="-1">
    <SectionContainer>
      <SectionTitle>
        <template #main>{{ $t('privacy.title') }}</template>
      </SectionTitle>
      <div class="privacy-content">
        <div class="privacy-intro">
          <span v-html="brandIntro"></span>
        </div>
        <div class="privacy-sections">
          <div v-for="(section, index) in tm('privacy.sections')" :key="index" class="privacy-section">
            <h3 class="section-title">{{ section.title }}</h3>
            <p class="section-content">
              <template v-if="section.title.includes('聯絡方式') || section.title.includes('Contact') || section.title.includes('Liên Hệ') || section.title.includes('연락처')">
                <span>{{ t('privacy.contactPrefix') }}</span><br>
                <a :href="telegramLink" class="text-link" target="_blank">
                  <img src="/images/icons/telegram.svg" class="icon-inline gold-icon" alt="Telegram" />@{{ telegramLabel }}
                </a><br>
                <a :href="lineLink" class="text-link" target="_blank">
                  <img src="/images/icons/line.svg" class="icon-inline gold-icon" alt="LINE" />@{{ lineLabel }}
                </a>
              </template>
              <template v-else>
                {{ section.content }}
              </template>
            </p>
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
import BrandLogo from '@/components/BrandLogo.vue';
import { useLocalePath } from '@/utils/i18n';
import { computed } from 'vue';

const { tm, t } = useI18n();
const route = useRoute();
const { localePath } = useLocalePath();
const contactPath = localePath('/contact');

// 统一读取联系方式变量
const telegramLabel = t('contact.telegram.label');
const telegramLink = t('contact.telegram.link');
const lineLabel = t('contact.line.label');
const lineLink = t('contact.line.link');

const brandIntro = computed(() => {
  // 用 i18n 插值替换 {brand}
  let intro = t('privacy.intro', { brand: t('brand.short') });
  // 用统一样式包裹品牌名
  return intro.replace(
    t('brand.short'),
    `<span class='about__brand-text'>${t('brand.short')}</span>`
  );
});

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
.privacy__brand-link {
  display: inline-block;
  vertical-align: middle;
  text-decoration: none;
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
  /* 若SVG支持currentColor则生效 */
}
.gold-icon {
  filter: brightness(0) saturate(100%) invert(83%) sepia(31%) saturate(638%) hue-rotate(358deg) brightness(103%) contrast(87%);
}
</style> 