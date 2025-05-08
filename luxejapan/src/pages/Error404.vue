<template>
  <div class="error-404" data-test="error-404" role="alert" aria-live="polite">
    <div class="error-404__content">
      <h1 class="error-404__title">404</h1>
      <p class="error-404__text">{{ $t('error.pageNotFound') }}</p>
      <router-link 
        :to="localePath('/')" 
        class="error-404__link"
        data-test="back-to-home"
        :aria-label="$t('nav.home')"
      >
        {{ $t('error.backToHome') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useLocalePath } from '@/utils/i18n'

const { localePath } = useLocalePath()
</script>

<style scoped>
.error-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: var(--spacing-xl);
  text-align: center;
  background: var(--color-secondary);
}

.error-404__content {
  max-width: 600px;
}

.error-404__title {
  font-size: 6rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  margin: 0 0 var(--spacing-md);
  line-height: 1;
}

.error-404__text {
  font-size: 1.5rem;
  margin: 0 0 var(--spacing-lg);
  color: var(--color-text);
}

.error-404__link {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-accent);
  color: var(--color-primary);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  transition: background var(--transition-normal);
}

.error-404__link:hover {
  background: var(--color-text);
}

.error-404__link:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .error-404__title {
    font-size: 4rem;
  }
  
  .error-404__text {
    font-size: 1.25rem;
  }
}
</style> 