<template>
  <main id="main-content" tabindex="-1">
    <Hero />
    <SectionDivider />
    <ServiceCards />
    <Gallery />
  </main>
</template>

<script setup>
import Hero from '@/components/Hero.vue';
import ServiceCards from '@/components/ServiceCards.vue';
import Gallery from '@/components/Gallery.vue';
import SectionDivider from '@/components/SectionDivider.vue';
</script>

<style scoped>
main {
  outline: none;
}
</style> 