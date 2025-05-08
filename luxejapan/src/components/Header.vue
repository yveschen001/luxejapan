<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-content">
      <router-link :to="localePath('/')" class="logo">
        <img src="@/assets/logo.svg" :alt="$t('brand.full')" />
      </router-link>
      <nav class="nav">
        <router-link :to="localePath('/')" class="nav-link">首頁</router-link>
        <router-link :to="localePath('/about')" class="nav-link">關於我們</router-link>
        <router-link :to="localePath('/services')" class="nav-link">服務項目</router-link>
        <router-link :to="localePath('/testimonials')" class="nav-link">客戶評價</router-link>
        <router-link :to="localePath('/contact')" class="nav-link">聯絡我們</router-link>
      </nav>
      <LanguageSwitcher />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { useLocalePath } from '@/utils/i18n';

const { localePath } = useLocalePath();
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: transparent;
  transition: background-color 0.3s ease;
}
.header-scrolled {
  background-color: var(--color-background);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: block;
}
.logo img {
  height: 40px;
  width: auto;
}
.nav {
  display: flex;
  gap: 2rem;
}
.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}
.nav-link:hover {
  color: var(--color-accent);
}
</style> 