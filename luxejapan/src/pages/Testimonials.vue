<template>
  <PageHero :title="$t('testimonials.title')" bg="/images/testimonials-bg.jpg" />
  <section class="testimonials">
    <SectionContainer>
      <SectionTitle class="testimonials-subtitle">
        <template #sub>{{ $t('testimonials.subtitle') }}</template>
      </SectionTitle>
      <div class="testimonials-list">
        <TestimonialCard
          v-for="testimonial in testimonials"
          :key="testimonial.nickname"
          :testimonial="testimonial"
        />
      </div>
    </SectionContainer>
  </section>
</template>

<script setup>
import SectionContainer from '@/components/SectionContainer.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import PageHero from '@/components/PageHero.vue';
import TestimonialCard from '@/components/TestimonialCard.vue';
import { useSeo } from '@/utils/useSeo';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { locale } = useI18n();
const route = useRoute();

useSeo({
  title: 'testimonials.title',
  description: 'testimonials.subtitle',
  image: '/images/testimonials-bg.jpg',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/testimonials`,
    'en': `/en/testimonials`
  }
});

const testimonials = [
  {
    nickname: 'JohnP',
    location: '台灣',
    content: '我沒想到來的女孩這麼好，完全是大家閨秀的氣質，讓我都覺得有點害羞。推開門就看到日本美女。跟一開始見面的閨秀印象相反，人非常親切，笑容十分可愛。謝謝黑木小姐帶給我如此美好的一天，期待下次再見面！'
  },
  {
    nickname: 'EmL',
    location: '香港',
    content: '第一次嘗試，感謝店長幫我訂到能在露臺賞櫻的餐廳，還有美麗的朝日奈小姐相伴。美景與佳人同在，會留著記憶裡！'
  },
  {
    nickname: 'PG',
    location: '台灣',
    content: '這次獨自前往富士山旅遊，完全沒有想到能把美女"外送"到所在的溫泉旅館。謝謝橋本小姐和店長，兩個小時車程真的辛苦你們了！'
  },
  {
    nickname: 'HansM',
    location: '中國',
    content: '終於挑戰人生中的第一次 3人行，下次想試試 4人，順便打場麻將，哈哈哈！'
  },
  {
    nickname: 'OliW',
    location: '澳洲',
    content: '難得放鬆的一晚。沒想到遇到人生中最美的「一番美女」，而且服務超貼心……看到她跪著為我服務，我都有點捨不得。真的想再約她一次！'
  },
  {
    nickname: 'WeiJun',
    location: '新加坡',
    content: '高挑模特身材！溫婉優雅、成熟魅力十足。按摩技術也是一流，完全沒有可挑剔的地方！'
  },
  {
    nickname: '小影',
    location: '台灣',
    content: '剛下飛機坐進 LM 車裡，美女就已經在旁邊座位等候，還穿着我指定的 OL 秘書裝和黑絲襪，故意沒扣好紐扣。從機場到飯店路上，忍不住牽她的小手…不大安分的…最後我們還回飯店立刻激情，謝謝天音小姐，還貼心準備了兩雙絲襪，雖然最後被我不小心撕壞了。'
  },
  {
    nickname: '俊',
    location: '台灣',
    content: '原本以為 Cosplay 要求有點過分，沒想到真的實現了和藍色頭髮的！謝謝上原小姐，幫我完美還原我喜歡的動漫角色，把髮飾弄壞真的很抱歉，可能我動太大力了。'
  },
  {
    nickname: 'MartinC',
    location: '加拿大',
    content: '這次挑戰體力與品味：三天不同美女，從 155cm、165cm 到 175cm 全部試過，發果然各有特色，各有深淺。店長，辛苦了！'
  },
  {
    nickname: 'SaA',
    location: '阿聯酋',
    content: '專屬按摩浴缸會所真的蠻特別的。感謝店長安排的 1 男 10 女比基尼生日派對，這是我最難忘、最累卻也是最開心的生日！'
  },
  {
    nickname: 'NiR',
    location: '俄羅斯',
    content: '人生第一次與日本 AV 女優同歡，日本服務果然細膩無比，就像高級餐廳一樣，精緻到無可挑剔。'
  },
  {
    nickname: 'ThaboS',
    location: '南非',
    content: '謝謝店長安排的東京灣遊艇派對，海上海風景太美，水野小姐的服務一流，沒想到加上船上的搖晃，體驗這麼特別，真是無話可說！'
  }
];
</script>

<style scoped>
.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
  margin-top: var(--spacing-xl);
  max-width: 700px;
}
.testimonials-subtitle {
  text-align: center;
  margin-bottom: 1.5rem;
}
@media (max-width: 900px) {
  .testimonials-list {
    max-width: 100%;
    gap: 1.2rem;
  }
}
</style> 