<template>
  <div class="testimonial-card">
    <div class="testimonial-card__header">
      <div class="testimonial-card__avatar">
        {{ testimonial.nickname.charAt(0) }}
      </div>
      <div class="testimonial-card__info">
        <div class="testimonial-card__nickname">{{ testimonial.nickname }}</div>
        <div class="testimonial-card__location">{{ testimonial.location }}</div>
      </div>
    </div>
    <div class="testimonial-card__content">
      {{ testimonial.content }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  testimonial: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.testimonial-card {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.testimonial-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.testimonial-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
}

.testimonial-card__info {
  flex: 1;
}

.testimonial-card__nickname {
  font-weight: var(--font-weight-semi);
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.testimonial-card__location {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.testimonial-card__content {
  color: var(--color-text);
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .testimonial-card {
    padding: var(--spacing-md);
  }
}
</style> 