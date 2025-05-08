<template>
  <PageHero :title="$t('about.title')" bg="/images/about-bg.jpg" />
  <main id="main-content" tabindex="-1">
    <h1 class="visually-hidden">{{ $t('about.title') }}</h1>
    <p>Luxe Japan 由日本風俗業界「米其林星級密探」南店長，與精通亞洲高端旅遊服務的坂東先生共同創辦。南店長不僅是風俗重度愛用者，更受多家風俗媒體委託進行高級服務暗訪；坂東先生多年來則專為頂級客人量身規劃行程。經過數年親身體驗與調查，我們發現：</p>
    <ul>
      <li>市面上廣告魚目混珠，如「高達二十萬日圓卻與女伴顏值不符」、「照片詐騙」、「換人服務」或「同一女伴掛多家招牌」等層出不窮；</li>
      <li>許多優質店家卻拒絕外國客人，信賴成本與溝通障礙大幅影響體驗；</li>
      <li>高端客人常須自行協調多家店家與繁瑣細節，難以享受完整無憂的服務。</li>
    </ul>
    <p>因此，我們以「客戶至上——誠實甄選最高級美女，滿足您的一切需求」為宗旨，打造真正的「高級伴遊服務」。</p>
    <p>多虧紳士們的支持，Luxe Japan 已贏得日本富裕階層的信任。憑藉廣泛人脈，我們嚴選自：模特兒經紀公司與藝能製作所旗下藝人、偶像、寫真模特兒；知名大學女大學生與研究生；東京著名酒吧及高級夜總會女主人；一流企業與醫美行業的優雅女性。</p>
    <p>在招募過程中，我們不僅重視外貌與身材，更要求具備良好常識、專業禮儀與優雅舉止。所有在籍佳人皆為社交能力出眾、性格開朗、智慧與品格並重的一流淑女，讓您感受到每一次相遇的難得與感動。</p>
    <h2>服務體驗</h2>
    <p>在 Luxe Japan，您無需為租車手續煩憂，也不用擔心法律與語言隔閡所帶來的糾紛。我們的專屬客服將全程引導：</p>
    <ul>
      <li>豪華接送：從機場至酒店，由 Toyota Alphard、LEXUS LM 或勞斯萊斯車隊護航；</li>
      <li>行程無縫對接：所有路線與預約均由我們統籌，讓您盡情放鬆；</li>
      <li>貼心陪伴：與嚴選佳人共度美好時光——無論是賞櫻、品酒、夜唱或私密休憩，一切細節都由我們替您打理。</li>
    </ul>
    <p>您只需放鬆心情，享受與心儀佳人共度的難忘時刻，其餘一切交給 Luxe Japan。</p>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue';
import { useSeo } from '@/utils/useSeo';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { locale } = useI18n();
const route = useRoute();

useSeo({
  title: 'about.title',
  description: 'about.philosophyDesc',
  image: '/images/about-bg.jpg',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/about`,
    'en': `/en/about`
  }
});
</script>

<style scoped>
main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
h2 {
  font-size: 2rem;
  color: var(--color-accent);
  margin-top: 2rem;
  margin-bottom: 1rem;
}
p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
ul {
  margin-bottom: 1.5rem;
}
li {
  margin-bottom: 0.5rem;
}
</style> 