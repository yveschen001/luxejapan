<template>
  <div class="telesoul-container py-12">
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
        {{ $t('home.title') }}
      </h1>
      <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
        {{ $t('home.subtitle') }}
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <router-link
          to="/register"
          class="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {{ $t('home.start') }}
        </router-link>
        <router-link
          to="/login"
          class="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
        >
          {{ $t('home.login') }} <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </div>

    <div class="mt-32">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div class="telesoul-card">
          <h3 class="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
            {{ $t('home.feature.match') }}
          </h3>
          <p class="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            {{ $t('home.feature.matchDesc') }}
          </p>
        </div>

        <div class="telesoul-card">
          <h3 class="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
            {{ $t('home.feature.safe') }}
          </h3>
          <p class="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            {{ $t('home.feature.safeDesc') }}
          </p>
        </div>

        <div class="telesoul-card">
          <h3 class="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
            {{ $t('home.feature.realtime') }}
          </h3>
          <p class="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            {{ $t('home.feature.realtimeDesc') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home page component
</script>

<style scoped>
.page.home {
  padding: 2rem;
  text-align: center;
}
</style> 