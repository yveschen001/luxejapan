<template>
  <div class="error-404" data-test="error-404" role="alert" aria-live="polite">
    <div class="error-404__content">
      <h1 class="error-404__title">404</h1>
      <p class="error-404__text">{{ $t('error404.message') }}</p>
      <a :href="base + $i18n.locale" class="error-404__link" data-test="back-to-home" aria-label="Back to Home">
        {{ $t('error404.backToHome') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const base = import.meta.env.BASE_URL
</script>

<style scoped>
.error-404 {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.error-404__content {
  text-align: center;
  padding: 2rem;
}

.error-404__title {
  font-size: 6rem;
  font-weight: bold;
  color: #dc3545;
  margin: 0;
}

.error-404__text {
  font-size: 1.5rem;
  color: #6c757d;
  margin: 1rem 0;
}

.error-404__link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.error-404__link:hover {
  background-color: #0056b3;
}
</style> 