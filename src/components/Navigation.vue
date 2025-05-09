<template>
  <nav aria-label="主导航" role="navigation">
    <router-link 
      v-for="item in navItems" 
      :key="item.path"
      :to="localePath(item.path)"
      :data-test="`nav-${item.path}`"
    >
      {{ $t(`nav.${item.path}`) }}
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      navItems: [
        { path: 'home', title: '首頁' },
        { path: 'about', title: '關於我們' },
        { path: 'services', title: '服務項目' },
        { path: 'process', title: '流程說明' },
        { path: 'contact', title: '聯絡我們' },
        { path: 'testimonials', title: '客戶評價' }
      ]
    }
  },
  methods: {
    localePath(path) {
      return `/${this.$i18n.locale}/${path}`
    }
  }
}
</script>

<style scoped>
nav {
  display: flex;
  gap: 2rem;
  padding: 1rem;
}

a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  color: #000;
}

a.router-link-active {
  color: #000;
  border-bottom: 2px solid #000;
}
</style> 