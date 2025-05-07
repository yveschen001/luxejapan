<template>
  <section class="process-faq">
    <h1>{{ $t('processFaq.title') }}</h1>
    <div class="section-divider-block">
      <img src="@/assets/images/section-divider-1.svg" alt="装饰分割线" class="section-divider" />
    </div>
    <div class="process-faq__tabs">
      <button :class="{active: tab==='process'}" @click="tab='process'">{{ $t('processFaq.processTab') }}</button>
      <button :class="{active: tab==='faq'}" @click="tab='faq'">{{ $t('processFaq.faqTab') }}</button>
    </div>
    <div v-if="tab==='process'" class="process-faq__section">
      <h2>{{ $t('processFaq.processTitle') }}</h2>
      <ol>
        <li v-for="(step, idx) in $tm('processFaq.processSteps')" :key="idx">{{ step }}</li>
      </ol>
    </div>
    <div v-else class="process-faq__section">
      <h2>{{ $t('processFaq.faqTitle') }}</h2>
      <ul>
        <li v-for="(item, idx) in $tm('processFaq.faqList')" :key="idx">
          <strong>{{ item.q }}</strong><br />
          <span>{{ item.a }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
const tab = ref('process');
</script>

<style scoped>
.process-faq {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}
.process-faq__tabs {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
.process-faq__tabs button {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius-sm);
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background var(--transition-normal);
}
.process-faq__tabs button.active,
.process-faq__tabs button:hover {
  background: var(--color-accent);
  color: var(--color-primary);
}
.process-faq__section {
  margin-bottom: var(--spacing-xl);
}
.section-divider-block {
  background: var(--color-primary);
  width: 100vw;
  min-width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 0;
}
.section-divider {
  width: 100%;
  max-width: 1200px;
  height: 16px;
  display: block;
}
</style> 