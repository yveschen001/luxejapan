<template>
  <PageHero :title="$t('processFaq.title')" bg="/images/process-faq-bg.jpg" />
  <SectionContainer>
    <h2>預約流程簡述</h2>
    <ol class="process-list">
      <li>
        <strong>線上諮詢</strong><br>
        透過 LINE 或網站表單告訴我們您的需求：日期、時間、地點、偏好風格……<br>
        我們的客服將以最快速度為您回覆，並確認細節。
      </li>
      <li>
        <strong>確認方案與報價</strong><br>
        根據您選擇的伴遊小姐層級、服務時長與附加項目（例如機場接送、私人酒會等），我們會為您量身報價。
      </li>
      <li>
        <strong>付款與預約完成</strong><br>
        支持日幣現金、USDT（依當日匯率計算）等多種方式，建議使用 USDT 以減少手續費。<br>
        完成付款後，即刻為您保留專屬時段與伴遊佳人。
      </li>
      <li>
        <strong>專屬歡迎</strong><br>
        服務當日，從機場接送、行程規劃、美女迎接，到結束送機，我們全程無縫協助，讓您只需放鬆享受。
      </li>
    </ol>
    <h2>常見問題</h2>
    <div class="faq-list">
      <div class="faq-item">
        <strong>Q1：服務價格大約是多少？</strong><br>
        <span>A1：<br>最低標準：10萬日圓／90 分鐘（視伴遊小姐等級而定）<br>如需機場接送、私人酒會、溫泉包場等額外需求，會另行報價再行加總。</span>
      </div>
      <div class="faq-item">
        <strong>Q2：可以先試試看嗎？</strong><br>
        <span>A2：<br>當然！建議您先體驗「10萬日圓／90 分鐘＋約 4,000 日圓交通費」的基本方案，感受我們的專業與貼心。</span>
      </div>
      <div class="faq-item">
        <strong>Q3：如果對某位小姐不合眼緣，可以換人嗎？</strong><br>
        <span>A3：<br>若小姐有明顯違規或服務失當，她本人可立刻被更換或取消服務。<br>如僅因個人喜好而要求更換，我們當天無法安排換人或退費。如有疑問，請聯繫客服協助。</span>
      </div>
      <div class="faq-item">
        <strong>Q4：我不會說日文，怎麼溝通？</strong><br>
        <span>A4：<br>完全不用擔心！我們的專屬客服會在行前替您溝通需求，也可現場透過 Google 翻譯或 ChatGPT 協助即時對話。</span>
      </div>
      <div class="faq-item">
        <strong>Q5：有哪些付款方式？</strong><br>
        <span>A5：<br>現金（日幣）<br>USDT（依台新銀行當日現金匯率折算）<br>建議使用 USDT，手續費最低、最方便。</span>
      </div>
      <div class="faq-item">
        <strong>Q6：為什麼初次預約要確認這麼多資料？</strong><br>
        <span>A6：<br>為了保障您與伴遊佳人的安全與隱私，我們需要確認您的基本資訊（手機號碼、飯店地址等），並遵循日本法規。</span>
      </div>
      <div class="faq-item">
        <strong>Q7：日本風俗上門服務「本番」是否違法？</strong><br>
        <span>A7：<br>日本法規僅允許半套服務，禁止「本番」行為。<br>但若因化學反應般的相互好感自然產生火花，是個人自由。如有疑慮，請事先告知，我們將協助您了解相關風險。</span>
      </div>
      <div class="faq-item">
        <strong>Q8：可以 3P 或多人同行嗎？</strong><br>
        <span>A8：<br>預先協調的多人行程可以安排，但適合的小姐較少，且費用通常按人數×1.2 起跳。<br>如有需求，請至少提前 72 小時與我們聯繫。</span>
      </div>
      <div class="faq-item">
        <strong>Q9：為什麼不能當天預約？</strong><br>
        <span>A9：<br>我們的伴遊佳人多擁有正職，且需提前妝髮打理，時間較難臨時安排。<br>建議您盡量提前預約，以確保心儀時段與佳人。</span>
      </div>
      <div class="faq-item">
        <strong>Q10：為什麼照片不露臉？</strong><br>
        <span>A10：<br>伴遊佳人多有其他正職工作，為保護隱私與職涯，僅提供身形、穿搭示意圖，不露真實面容。</span>
      </div>
      <div class="faq-item">
        <strong>Q11：加入 LINE 後無人回應？</strong><br>
        <span>A11：<br>請確認已成功加入後，主動發送一則文字或表情符號，我們便可收到通知並立刻回覆您。</span>
      </div>
    </div>
  </SectionContainer>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue';
import SectionContainer from '@/components/SectionContainer.vue';
import { useSeo } from '@/utils/useSeo';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { locale } = useI18n();
const route = useRoute();

useSeo({
  title: 'processFaq.title',
  description: 'processFaq.subtitle',
  image: '/images/process-faq-bg.jpg',
  canonical: window.location.origin + route.fullPath,
  alternates: {
    'zh-tw': `/zh-tw/process-faq`,
    'en': `/en/process-faq`
  }
});
</script>

<style scoped>
.process-list {
  margin: 2rem 0 2.5rem 1.2em;
  padding: 0;
  list-style: decimal;
  color: var(--color-text);
  font-size: 1.08rem;
  line-height: 1.8;
}
.faq-list {
  margin-top: 2.5rem;
}
.faq-item {
  margin-bottom: 1.5rem;
  color: var(--color-text);
  font-size: 1.08rem;
  line-height: 1.7;
}
h2 {
  font-size: 2rem;
  color: var(--color-accent);
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style> 