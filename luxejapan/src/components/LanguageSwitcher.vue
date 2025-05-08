<template>
  <div class="language-switcher" data-test="language-switcher" role="group" aria-label="语言切换">
    <button 
      v-for="lang in languages" 
      :key="lang.code"
      :data-test="`language-option-${lang.code}`"
      :class="{ active: currentLang === lang.code }"
      :aria-label="`切换到${lang.name}`"
      :aria-pressed="currentLang === lang.code"
      @click="switchLanguage(lang.code)"
    >
      {{ lang.name }}
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      languages: [
        { code: 'zh-tw', name: '繁體中文' },
        { code: 'en', name: 'English' }
      ],
      currentLang: 'zh-tw'
    }
  },
  mounted() {
    // 初始化时同步全局语言
    const { locale } = useI18n()
    this.currentLang = locale.value
  },
  methods: {
    switchLanguage(lang) {
      const { locale } = useI18n()
      locale.value = lang
      this.currentLang = lang
      this.$emit('language-change', lang)
    }
  }
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-accent);
  border-radius: 4px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: var(--color-accent);
  color: var(--color-primary);
}

button.active {
  background: var(--color-accent);
  color: var(--color-primary);
}

button:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style> 