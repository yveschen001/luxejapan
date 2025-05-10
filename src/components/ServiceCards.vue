<template>
  <section 
    class="service-cases" 
    aria-labelledby="service-cases-title"
    itemscope 
    itemtype="https://schema.org/ItemList"
  >
    <h2 id="service-cases-title" class="service-cases__title">{{$t('services.title')}}</h2>
    <div class="service-cases__grid">
      <article v-for="(item, i) in casesWithImg" :key="'service-case-'+i" class="service-case" itemscope itemtype="https://schema.org/Service" itemprop="itemListElement">
        <picture>
          <img 
            class="service-case__img" 
            :src="item.img" 
            :alt="item.alt"
            loading="lazy"
            width="600"
            height="400"
            decoding="async"
            itemprop="image"
          />
        </picture>
        <div class="service-case__content">
          <h3 class="service-case__name" itemprop="name">{{ item.title }}</h3>
          <p class="service-case__desc" itemprop="description">{{ item.desc }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { tm, t } = useI18n();
const base = import.meta.env.BASE_URL;

// 修复：用 computed 预处理图片路径，确保 __BASE_URL__ 被替换
const casesWithImg = computed(() =>
  tm('serviceCards.cases').map(item => ({
    ...item,
    img: item.img.replace('__BASE_URL__', base)
  }))
);

// 添加結構化數據
onMounted(() => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Service",
        "position": 1,
        "name": t('serviceCards.cases.0.title'),
        "description": t('serviceCards.cases.0.desc'),
        "image": base + 'images/about-bg.jpg'
      },
      {
        "@type": "Service",
        "position": 2,
        "name": t('serviceCards.cases.1.title'),
        "description": t('serviceCards.cases.1.desc'),
        "image": base + 'images/testimonials-bg.jpg'
      },
      {
        "@type": "Service",
        "position": 3,
        "name": t('serviceCards.cases.2.title'),
        "description": t('serviceCards.cases.2.desc'),
        "image": base + 'images/process-faq-bg.jpg'
      }
    ]
  };

  // 添加結構化數據到頁面
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
});
</script>

<style scoped>
.service-cases {
  max-width: 1100px;
  margin: 0 auto 3.5rem auto;
  padding: 0 1.2rem;
}
.service-cases__title {
  text-align: center;
  font-family: var(--font-primary);
  font-size: 2.2rem;
  color: var(--color-accent);
  margin-bottom: 2.2rem;
}
.service-cases__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.service-case {
  background: var(--color-surface);
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(45,27,77,0.06);
  overflow: hidden;
  max-width: 340px;
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.service-case:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(45,27,77,0.1);
}
.service-case__img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}
.service-case__content {
  padding: 1.2rem 1.2rem 1.5rem 1.2rem;
  text-align: center;
}
.service-case__name {
  font-size: 1.25rem;
  color: var(--color-accent);
  font-family: var(--font-primary);
  margin-bottom: 0.7rem;
}
.service-case__desc {
  color: var(--color-text);
  font-size: 1.05rem;
  line-height: 1.7;
}
@media (max-width: 900px) {
  .service-cases__grid {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
  .service-case {
    max-width: 98vw;
  }
}
</style> 