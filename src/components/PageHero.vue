<template>
  <section class="page-hero" :style="bgStyle">
    <div class="page-hero__overlay"></div>
    <div class="page-hero__content">
      <h1 class="page-hero__title">{{ title }}</h1>
      <SectionDivider />
    </div>
  </section>
</template>

<script setup>
import SectionDivider from '@/components/SectionDivider.vue';
const props = defineProps({
  title: { type: String, required: true },
  bg: { type: String, default: '' }
});
const bgUrl = props.bg ? `/luxejapan-public${props.bg}` : '/luxejapan-public/images/default-bg.jpg';
const bgStyle = {
  backgroundImage: `url('${bgUrl}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative'
};
</script>

<style scoped>
.page-hero {
  position: relative;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-repeat: no-repeat;
}
.page-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(34,18,54,0.82) 60%, rgba(34,18,54,0.96) 100%);
  z-index: 1;
}
.page-hero__content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2.2rem 0.8rem 1.2rem 0.8rem;
}
.page-hero__title {
  font-family: var(--font-primary);
  font-size: 2.5rem;
  color: var(--color-text);
  margin: 1rem 0 1.2rem 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
@media (min-width: 600px) {
  .page-hero {
    min-height: 320px;
  }
  .page-hero__content {
    padding: 3rem 1rem 2rem 1rem;
  }
  .page-hero__title {
    font-size: 2.5rem;
    margin: 1.2rem 0 1.5rem 0;
  }
}
</style> 