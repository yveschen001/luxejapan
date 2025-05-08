<template>
  <main id="main-content" tabindex="-1">
    <Hero />
    <SectionContainer id="intro">
      <h2 class="intro-title">介紹</h2>
      <div class="intro-content">
        <p>想一探日本風俗的奢華魅力，卻擔心街頭上魚龍混雜、語言不通、踩雷上當？<br>
        尊貴的客人，這些都不是您需要擔心的，Luxe Japan 將爲您安排真正高端的風俗之旅。</p>
        <p>交給我們──您的專屬風俗旅程顧問，從此安心無憂，盡享日本最頂級的風俗伴遊體驗。</p>
        <ul class="intro-list">
          <li><strong>皇室級接送</strong><br>
            – 勞斯萊斯、LEXUS LM、Toyota Alphard……<br>
            – 機場接駁、城市穿梭，豪車全天候護航。</li>
          <li><strong>專屬顧問規劃</strong><br>
            – 一對一行程設計，從客人愛好、行程的規劃都能事先為您規劃。<br>
            – 私人助理客服協助，確保每個細節都符合您的偏好。</li>
          <li><strong>極致伴遊體驗</strong><br>
            – 嚴選日本最優雅、浪漫兼備的風俗佳人。<br>
            – 私密晚宴、VIP 盛會、城市漫步或溫泉賞櫻，全程貼心相伴。</li>
          <li><strong>五星級隱私守護</strong><br>
            – 嚴格保密協議與專業服務，讓您盡情放鬆、無後顧之憂。</li>
        </ul>
        <p style="margin-top:1.2em;">
          現在就與 <span class="intro-brand">Luxe Japan</span> 預約，
          <a href="/contact" class="intro-link">開啟專屬您的東京風俗奢華之旅！</a>
        </p>
      </div>
    </SectionContainer>
    <SectionDivider />
    <ServiceCards />
  </main>
</template>

<script setup>
import Hero from '@/components/Hero.vue';
import ServiceCards from '@/components/ServiceCards.vue';
import SectionDivider from '@/components/SectionDivider.vue';
import SectionContainer from '@/components/SectionContainer.vue';
</script>

<style scoped>
main {
  outline: none;
}
:deep(.section-container) {
  text-align: left;
}
.intro-title {
  font-size: 2rem;
  color: var(--color-accent);
  font-family: var(--font-primary);
  margin-bottom: 1.2rem;
}
.intro-content {
  color: var(--color-text);
  font-size: 1.08rem;
  line-height: 1.8;
}
.intro-list {
  margin: 1.2rem 0 1.2rem 1.2em;
  padding: 0;
  list-style: disc;
}
.intro-list li {
  margin-bottom: 1.1em;
}
.intro-brand {
  color: var(--color-accent);
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  letter-spacing: 0.08em;
}
.intro-link {
  color: var(--color-accent);
  text-decoration: underline;
  font-weight: 600;
}
.intro-link:hover {
  color: var(--color-text);
}
</style> 