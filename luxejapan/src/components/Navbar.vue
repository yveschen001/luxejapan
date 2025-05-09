<template>
  <nav class="navbar" role="navigation" aria-label="Main Navigation">
    <div class="navbar__brand">
      <router-link :to="localePath('/')" class="navbar__brand" :aria-label="$t('brand.full') + ' 首页'">
        <img src="/logo-geisha-gold.png" :alt="$t('brand.full') + ' Logo'" class="navbar__logo" />
        <BrandLogo size="2rem" />
      </router-link>
    </div>
    <div v-if="menuOpen" class="navbar__overlay" @click="menuOpen = false"></div>
    <ul class="navbar__links" :class="{ open: menuOpen }" id="main-nav">
      <li><router-link :to="localePath('/')" class="navbar__link" @click="menuOpen = false">{{ $t('nav.home') }}</router-link></li>
      <li><router-link :to="localePath('/about')" class="navbar__link" @click="menuOpen = false">{{ $t('nav.about') }}</router-link></li>
      <li><router-link :to="localePath('/process-faq')" class="navbar__link" @click="menuOpen = false">{{ $t('nav.processFaq') }}</router-link></li>
      <li><router-link :to="localePath('/testimonials')" class="navbar__link" @click="menuOpen = false">{{ $t('nav.testimonials') }}</router-link></li>
      <li><router-link :to="localePath('/contact')" class="navbar__link" @click="menuOpen = false">{{ $t('nav.contact') }}</router-link></li>
      <!-- 移动端语言切换入口 -->
      <li class="navbar__lang-mobile mobile-only">
        <button class="navbar__lang" @click.stop="toggleLangMenu" :aria-label="$t('nav.switchLang')">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="2"/>
            <ellipse cx="11" cy="11" rx="9" ry="4" stroke="currentColor" stroke-width="2"/>
            <path d="M11 2a9 9 0 0 1 0 18M2 11h18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <div v-if="langMenuOpen" class="lang-menu lang-menu-mobile">
          <button v-for="lang in languages" :key="lang.code" @click="switchLanguage(lang.code)" :class="{ active: locale === lang.code }">
            {{ lang.label }}
          </button>
        </div>
      </li>
    </ul>
    <!-- 桌面端语言切换按钮，仅PC端显示 -->
    <div class="navbar__lang-wrap desktop-only">
      <button class="navbar__lang" @click.stop="toggleLangMenu" :aria-label="$t('nav.switchLang')">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="2"/>
          <ellipse cx="11" cy="11" rx="9" ry="4" stroke="currentColor" stroke-width="2"/>
          <path d="M11 2a9 9 0 0 1 0 18M2 11h18" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      <div v-if="langMenuOpen" class="lang-menu">
        <button v-for="lang in languages" :key="lang.code" @click="switchLanguage(lang.code)" :class="{ active: locale === lang.code }">
          {{ lang.label }}
        </button>
      </div>
    </div>
    <!-- 汉堡菜单 -->
    <button class="navbar__toggle mobile-only" @click="menuOpen = !menuOpen" aria-label="Toggle menu" :aria-expanded="menuOpen.toString()" aria-controls="main-nav">
      <span class="navbar__toggle-icon" :class="{ open: menuOpen }"></span>
    </button>
  </nav>
</template>

<script setup>
import { ref, watchEffect, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import BrandLogo from '@/components/BrandLogo.vue';
import { useLocalePath } from '@/utils/i18n';

const menuOpen = ref(false);
const langMenuOpen = ref(false);
const { locale } = useI18n();
const router = useRouter();
const { localePath, switchLocalePath } = useLocalePath();

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh-tw', label: '繁體中文' },
  { code: 'ko', label: '한국어' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'es', label: 'Español' }
];

function toggleLangMenu() {
  langMenuOpen.value = !langMenuOpen.value;
}
function switchLanguage(code) {
  locale.value = code;
  router.push(switchLocalePath(code));
  langMenuOpen.value = false;
}
// 点击外部关闭语言菜单
function handleClickOutside(event) {
  if (!event.target.closest('.navbar__lang') && !event.target.closest('.lang-menu')) {
    langMenuOpen.value = false;
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside);
}
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside);
  }
});
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
  box-shadow: 0 2px 12px 0 rgba(45,27,77,0.08);
  border-bottom: 1px solid rgba(212,175,55,0.08);
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
  align-items: center;
  gap: 2.2rem;
  margin-left: 2.5rem;
}
.navbar__link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.08rem;
  letter-spacing: 0.02em;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
  position: relative;
}
.navbar__link:hover, .navbar__link:focus {
  color: var(--color-accent);
  background: rgba(212,175,55,0.10);
}
.navbar__lang-wrap {
  position: relative;
  margin-left: 2.5rem;
  display: flex;
  align-items: center;
}
.navbar__lang {
  background: transparent;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 0.45rem 0.7rem 0.35rem 0.7rem;
  margin-left: 0;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: none;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.navbar__lang:hover, .navbar__lang:focus {
  background: rgba(255,255,255,0.10);
  color: #fff;
  box-shadow: none;
}
.navbar__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  margin-left: var(--spacing-md);
  cursor: pointer;
  min-width: 0;
  min-height: 0;
  padding: 0;
  position: relative;
  z-index: 1201;
}
.navbar__toggle-icon {
  width: 28px;
  height: 4px;
  background: var(--color-text);
  border-radius: 2px;
  position: relative;
  display: block;
  transition: background 0.3s;
}
.navbar__toggle-icon::before,
.navbar__toggle-icon::after {
  content: '';
  position: absolute;
  width: 28px;
  height: 4px;
  background: var(--color-text);
  border-radius: 2px;
  transition: transform 0.3s, top 0.3s, opacity 0.3s;
}
.navbar__toggle-icon::before {
  top: -9px;
}
.navbar__toggle-icon::after {
  top: 9px;
}
.navbar__toggle-icon.open {
  background: transparent;
}
.navbar__toggle-icon.open::before {
  top: 0;
  transform: rotate(45deg);
}
.navbar__toggle-icon.open::after {
  top: 0;
  transform: rotate(-45deg);
}
.navbar__overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 10, 30, 0.55);
  z-index: 999;
  transition: opacity 0.3s;
}
.lang-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: linear-gradient(135deg,rgba(30,10,50,0.98) 60%,rgba(212,175,55,0.10) 100%);
  border: 1.5px solid var(--color-accent);
  border-radius: 14px;
  box-shadow: 0 8px 32px 0 rgba(45,27,77,0.18), 0 1.5px 6px 0 rgba(212,175,55,0.13);
  min-width: 148px;
  padding: 0.5rem 0.2rem;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: langMenuFadeIn 0.22s cubic-bezier(0.4,0,0.2,1);
  backdrop-filter: blur(4px);
}
@keyframes langMenuFadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.lang-menu button {
  background: none;
  border: none;
  color: var(--color-text);
  padding: 0.65rem 1.2rem;
  text-align: left;
  cursor: pointer;
  font-size: 1.04rem;
  border-radius: 8px;
  transition: background 0.18s, color 0.18s;
  margin: 0 0.2rem;
}
.lang-menu button:hover, .lang-menu button.active {
  background: var(--color-accent);
  color: var(--color-primary);
}
.desktop-only { display: flex; }
.mobile-only { display: none; }
@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: inline-flex !important; }
  .navbar__lang-mobile { width: 100%; display: flex; justify-content: flex-end; margin-top: 2.5rem; }
  .lang-menu-mobile {
    position: static;
    margin-top: 0.5rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.14);
    border-radius: 8px;
    min-width: 130px;
    background: var(--color-surface);
    border: 1px solid var(--color-accent);
    z-index: 2100;
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .navbar__links {
    display: none;
    flex-direction: column;
    gap: var(--spacing-lg);
    position: fixed;
    top: 0;
    right: -75vw;
    width: 75vw;
    height: 100vh;
    background: linear-gradient(
      to bottom,
      rgba(30,10,50,0.88) 0%,
      rgba(30,10,50,0.55) 60%,
      rgba(30,10,50,0.0) 100%
    );
    padding: 5.5rem 6rem 2rem 2.5rem;
    box-shadow: -2px 0 16px 0 rgba(0,0,0,0.12);
    z-index: 1100;
    align-items: flex-end;
    justify-content: flex-start;
    transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .navbar__links.open {
    display: flex;
    right: 0;
  }
  .navbar__toggle {
    position: fixed;
    top: 2rem;
    right: 2rem;
    z-index: 2000;
    display: inline-flex;
  }
  .navbar__lang {
    position: fixed;
    top: 2rem;
    right: 5.5rem;
    z-index: 2000;
    margin-left: 0;
  }
}
</style> 