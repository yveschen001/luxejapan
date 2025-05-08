<template>
  <section class="gallery" aria-labelledby="gallery-title">
    <h2 id="gallery-title" class="gallery__title">{{ $t('gallery.title') }}</h2>
    <div class="gallery__grid">
      <figure v-for="(img, idx) in images" :key="idx" class="gallery__item">
        <img :src="img.src" :alt="$t(img.alt)" loading="lazy" />
        <figcaption class="gallery__caption">{{ $t(img.caption) }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
const images = [
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    alt: 'gallery.img1.alt',
    caption: 'gallery.img1.caption',
  },
  {
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    alt: 'gallery.img2.alt',
    caption: 'gallery.img2.caption',
  },
  {
    src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    alt: 'gallery.img3.alt',
    caption: 'gallery.img3.caption',
  },
];
</script>

<style scoped>
.gallery {
  padding: var(--spacing-xl) var(--spacing-md);
  background: var(--color-background);
}
.gallery__title {
  text-align: center;
  font-family: var(--font-primary);
  font-size: 2.2rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-xl);
}
.gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1100px;
  margin: 0 auto;
}
.gallery__item {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
}
.gallery__item:hover {
  box-shadow: var(--shadow-md);
  transform: scale(1.03);
}
.gallery__item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}
.gallery__caption {
  padding: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  text-align: center;
}
</style> 