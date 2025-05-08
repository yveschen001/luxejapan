<template>
  <section 
    class="service-cases" 
    aria-labelledby="service-cases-title"
    itemscope 
    itemtype="https://schema.org/ItemList"
  >
    <h2 id="service-cases-title" class="service-cases__title">服務案例</h2>
    <div class="service-cases__grid">
      <article 
        class="service-case"
        itemscope 
        itemtype="https://schema.org/Service"
        itemprop="itemListElement"
      >
        <picture>
          <img 
            class="service-case__img" 
            src="/images/about-bg.jpg" 
            :alt="$t('serviceCards.homeComfortAlt')"
            loading="lazy"
            width="600"
            height="400"
            decoding="async"
            itemprop="image"
          />
        </picture>
        <div class="service-case__content">
          <h3 class="service-case__name" itemprop="name">到府溫柔慰藉</h3>
          <p class="service-case__desc" itemprop="description">從 90 分鐘的初見 開始，彷彿一場甜蜜邂逅。伴遊佳人輕步上門，悄然出現在您指定的飯店或民宿。短短時光中，您將感受日本女性的纖細溫柔—她輕撫發絲、柔聲低語，用浪漫的眼神洗滌旅途的疲憊與孤寂，讓您彷彿回到戀愛中的暖心時刻。</p>
        </div>
      </article>
      <article 
        class="service-case"
        itemscope 
        itemtype="https://schema.org/Service"
        itemprop="itemListElement"
      >
        <picture>
          <img 
            class="service-case__img" 
            src="/images/testimonials-bg.jpg" 
            :alt="$t('serviceCards.tokyoLoverAlt')"
            loading="lazy"
            width="600"
            height="400"
            decoding="async"
            itemprop="image"
          />
        </picture>
        <div class="service-case__content">
          <h3 class="service-case__name" itemprop="name">東京戀人漫遊</h3>
          <p class="service-case__desc" itemprop="description">與心儀佳人約會於飯店樓下私廊餐廳，共赴一場美食與微醺的前奏。隨後漫步櫻花盛放的街道，穿梭於霓虹閃爍的巷弄，探索東京獨特風情。夜幕低垂時，攜手回到您的私密空間，享受更深度的交流與心靈契合，讓彼此的心靠得更近，甜蜜溫度一再升華。</p>
        </div>
      </article>
      <article 
        class="service-case"
        itemscope 
        itemtype="https://schema.org/Service"
        itemprop="itemListElement"
      >
        <picture>
          <img 
            class="service-case__img" 
            src="/images/process-faq-bg.jpg" 
            :alt="$t('serviceCards.luxuryNightAlt')"
            loading="lazy"
            width="600"
            height="400"
            decoding="async"
            itemprop="image"
          />
        </picture>
        <div class="service-case__content">
          <h3 class="service-case__name" itemprop="name">奢華私人會所夜宴</h3>
          <p class="service-case__desc" itemprop="description">預約專屬於您的 頂級私人會所，沉浸於低調奢華的夜色之中。從知名調酒師的調製細膩調酒，到眾多日本美女優雅陪伴，為您譜寫一晚無與倫比的浪漫序章。您亦可攜友作客，或舉辦小型慶生、商務聯誼；更可在配備按摩浴缸的 VIP 套房內舉辦比基尼派對，讓水花與情誼同時迸發。只需於行前告知您的心願，我們即刻為您量身訂製，讓每一刻都符合您的夢想與品味。</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

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