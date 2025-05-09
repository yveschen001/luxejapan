<template>
  <section 
    class="service-cases" 
    aria-labelledby="service-cases-title"
    itemscope 
    itemtype="https://schema.org/ItemList"
  >
    <h2 id="service-cases-title" class="service-cases__title">{{$t('services.title')}}</h2>
    <div class="service-cases__grid">
      <article v-for="(item, i) in tm('serviceCards.cases')" :key="'service-case-'+i" class="service-case" itemscope itemtype="https://schema.org/Service" itemprop="itemListElement">
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
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { tm } = useI18n();
const base = import.meta.env.BASE_URL;
const cards = [
  {
    title: 'Home Comfort',
    desc: 'Begin with a 90-minute initial meeting, like a sweet rendez-vous. Our elegant companion will arrive discreetly at your hotel or residence. In this brief time, you\'ll experience the delicacy of Japanese femininity - her gentle touch, intimate whispers, and romantic gaze that will relieve your fatigue and loneliness, transporting you to moments of romance.',
    img: '/images/about-bg.jpg',
    alt: 'Home comfort service'
  },
  {
    title: 'Romantic Tokyo Stroll',
    desc: 'Meet your ideal companion at your hotel\'s private restaurant, enjoying a delicious dinner and intimate atmosphere. Then, stroll through cherry blossom-lined streets, explore neon-lit alleys, discovering Tokyo\'s unique charm. As night falls, retreat to your private space for deeper connection and intimate moments, elevating the temperature of your romance.',
    img: '/images/testimonials-bg.jpg',
    alt: 'Tokyo escort service'
  },
  {
    title: 'Luxury Night at Private Club',
    desc: 'Reserve your exclusive private club, immersing yourself in the sophisticated night atmosphere. From artisanal cocktails by renowned bartenders to the company of elegant Japanese ladies, we create an unforgettable night. Invite friends or celebrate special occasions; organize bikini parties in our VIP suite with jacuzzi. Just tell us your desires, and we\'ll create perfect moments according to your dreams and preferences.',
    img: '/images/process-faq-bg.jpg',
    alt: 'Luxury nightclub service'
  }
];

// 添加結構化數據
onMounted(() => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Service",
        "position": 1,
        "name": "到府溫柔慰藉",
        "description": "從 90 分鐘的初見 開始，彷彿一場甜蜜邂逅。伴遊佳人輕步上門，悄然出現在您指定的飯店或民宿。",
        "image": "/images/about-bg.jpg"
      },
      {
        "@type": "Service",
        "position": 2,
        "name": "東京戀人漫遊",
        "description": "與心儀佳人約會於飯店樓下私廊餐廳，共赴一場美食與微醺的前奏。",
        "image": "/images/testimonials-bg.jpg"
      },
      {
        "@type": "Service",
        "position": 3,
        "name": "奢華私人會所夜宴",
        "description": "預約專屬於您的 頂級私人會所，沉浸於低調奢華的夜色之中。",
        "image": "/images/process-faq-bg.jpg"
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