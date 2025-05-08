<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <Navbar />
  <main id="main-content">
    <router-view />
  </main>
  <Footer />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
</script>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-accent);
  color: var(--color-primary);
  padding: 8px;
  z-index: 100;
  transition: top 0.3s ease;
}
.skip-link:focus {
  top: 0;
}
</style> 