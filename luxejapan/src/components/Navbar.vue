<template>
  <nav class="navbar" role="navigation" aria-label="Main Navigation">
    <div class="navbar__brand">
      <router-link :to="localePath('/')" class="navbar__brand" aria-label="Luxe Japan 首页">
        <img src="/logo-geisha-gold.png" alt="Luxe Japan Logo" class="navbar__logo" />
        <BrandLogo size="2rem" />
      </router-link>
    </div>
    <div v-if="menuOpen" class="navbar__overlay" @click="menuOpen = false"></div>
    <ul class="navbar__links" :class="{ open: menuOpen }" id="main-nav">
      <li><router-link :to="localePath('/')" class="navbar__link">{{ $t('nav.home') }}</router-link></li>
      <li><router-link :to="localePath('/about')" class="navbar__link">{{ $t('nav.about') }}</router-link></li>
      <li><router-link :to="localePath('/process-faq')" class="navbar__link">{{ $t('nav.processFaq') }}</router-link></li>
      <li><router-link :to="localePath('/testimonials')" class="navbar__link">{{ $t('nav.testimonials') }}</router-link></li>
      <li><router-link :to="localePath('/contact')" class="navbar__link">{{ $t('nav.contact') }}</router-link></li>
    </ul>
    <button class="navbar__lang" @click="toggleLang" :aria-label="$t('nav.switchLang')">
      {{ currentLocale === 'en' ? '繁體' : 'EN' }}
    </button>
    <button class="navbar__toggle" @click="menuOpen = !menuOpen" aria-label="Toggle menu" :aria-expanded="menuOpen.toString()" aria-controls="main-nav">
      <span class="navbar__toggle-icon"></span>
    </button>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import BrandLogo from '@/components/BrandLogo.vue';
import { useLocalePath } from '@/utils/i18n';

const menuOpen = ref(false);
const { locale } = useI18n();
const router = useRouter();
const { localePath, switchLocalePath } = useLocalePath();
const currentLocale = ref(locale.value);

function toggleLang() {
  const newLocale = currentLocale.value === 'en' ? 'zh-tw' : 'en';
  currentLocale.value = newLocale;
  locale.value = newLocale;
  // 切換語言時自動跳轉到對應語言頁面
  router.push(switchLocalePath(newLocale));
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-primary);
  color: var(--color-text);
  padding: var(--spacing-md) var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 1000;
}
.navbar__brand {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  text-decoration: none !important;
  border: none !important;
  box-shadow: none !important;
}
.navbar__brand:focus, .navbar__brand:active {
  outline: none !important;
}
.navbar__logo {
  height: 54px;
  width: 54px;
  object-fit: contain;
  border-radius: 50%;
  background: transparent;
}
.navbar__title {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.08em;
  text-shadow: 0 2px 8px rgba(212,175,55,0.08);
  line-height: 1.1;
}
.navbar__links {
  display: flex;
  gap: var(--spacing-lg);
  list-style: none;
}
.navbar__link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: var(--font-weight-semi);
  transition: color var(--transition-normal);
}
.navbar__link:hover {
  color: var(--color-accent);
}
.navbar__lang {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius-sm);
  padding: 0.5rem 1rem;
  margin-left: var(--spacing-md);
  cursor: pointer;
  transition: background var(--transition-normal);
}
.navbar__lang:hover {
  background: var(--color-accent);
  color: var(--color-primary);
}
.navbar__toggle {
  display: none;
  background: none;
  border: none;
  margin-left: var(--spacing-md);
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 1101;
}
.navbar__toggle-icon {
  width: 28px;
  height: 3px;
  background: var(--color-text);
  display: block;
  position: absolute;
  top: 50%;
  left: 6px;
  transform: translateY(-50%);
  border-radius: 2px;
  transition: background 0.3s;
}
.navbar__toggle-icon::before,
.navbar__toggle-icon::after {
  content: '';
  position: absolute;
  width: 28px;
  height: 3px;
  background: var(--color-text);
  border-radius: 2px;
  transition: transform 0.3s, top 0.3s, bottom 0.3s;
}
.navbar__toggle-icon::before {
  top: -10px;
  left: 0;
}
.navbar__toggle-icon::after {
  bottom: -10px;
  left: 0;
}
.navbar__overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 10, 30, 0.55);
  z-index: 999;
  transition: opacity 0.3s;
}
@media (max-width: 768px) {
  .navbar__links {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    position: fixed;
    top: 0;
    right: -65vw;
    width: 65vw;
    height: 100vh;
    background: var(--color-primary);
    padding: 5.5rem 2.5rem 2rem 2.5rem;
    box-shadow: -2px 0 16px 0 rgba(0,0,0,0.12);
    z-index: 1100;
    align-items: flex-end;
    justify-content: flex-start;
    transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .navbar__links.open {
    right: 0;
  }
  .navbar__link {
    font-size: 1.25rem;
    font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 600;
    padding: 0.5rem 0;
    color: var(--color-text);
    text-align: right;
    width: 100%;
    transition: color 0.2s;
  }
  .navbar__link:hover {
    color: var(--color-accent);
  }
  .navbar__toggle {
    display: block;
  }
}
</style> 