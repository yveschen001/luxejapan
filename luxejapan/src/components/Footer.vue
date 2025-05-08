<template>
  <footer class="footer" role="contentinfo">
    <div class="footer__content">
      <div class="footer__brand">
        <img src="/logo-geisha-gold.png" :alt="$t('brand.full') + ' Logo'" class="footer__logo" />
        <BrandLogo size="1.3rem" />
      </div>
      <div class="footer__links">
        <router-link :to="localePath('/about')" class="footer__link">{{ $t('nav.about') }}</router-link>
        <router-link :to="localePath('/process-faq')" class="footer__link">{{ $t('nav.processFaq') }}</router-link>
        <router-link :to="localePath('/testimonials')" class="footer__link">{{ $t('nav.testimonials') }}</router-link>
        <router-link :to="localePath('/contact')" class="footer__link">{{ $t('nav.contact') }}</router-link>
      </div>
      <div class="footer__social">
        <a :href="contacts.line.url" target="_blank" class="footer__social-link" aria-label="Line">
          <img src="/icons/line.svg" alt="Line" class="footer__social-icon" />
        </a>
        <a :href="contacts.telegram.url" target="_blank" class="footer__social-link" aria-label="Telegram">
          <img src="/icons/telegram.svg" alt="Telegram" class="footer__social-icon" />
        </a>
        <a :href="contacts.x.url" target="_blank" class="footer__social-link" aria-label="X.com">
          <img src="/icons/x.svg" alt="X.com" class="footer__social-icon" />
        </a>
      </div>
      <div class="footer__legal">
        <router-link :to="localePath('/privacy')" class="footer__legal-link">{{ $t('footer.privacy') }}</router-link>
        <router-link :to="localePath('/terms')" class="footer__legal-link">{{ $t('footer.terms') }}</router-link>
      </div>
      <div class="footer__copyright">
        &copy; {{ new Date().getFullYear() }} <BrandLogo size="1.1rem" style="vertical-align:middle" />. {{ $t('footer.rights') }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import BrandLogo from '@/components/BrandLogo.vue';
import { useLocalePath } from '@/utils/i18n';
import contacts from '@/config/contacts';

const { localePath } = useLocalePath();
</script>

<style scoped>
.footer {
  background: var(--color-primary);
  color: var(--color-text);
  padding: var(--spacing-lg) 0 var(--spacing-md) 0;
  text-align: center;
}
.footer__content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}
.footer__brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: var(--spacing-sm);
}
.footer__logo {
  height: 40px;
  width: 40px;
  object-fit: contain;
}
.footer__title {
  font-family: var(--font-primary);
  font-size: 1.3rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
}
.footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}
.footer__link {
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color var(--transition-normal);
}
.footer__link:hover {
  color: var(--color-accent);
}
.footer__social {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}
.footer__social-link {
  color: var(--color-accent);
  transition: color var(--transition-normal);
}
.footer__social-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) saturate(100%) invert(83%) sepia(31%) saturate(638%) hue-rotate(358deg) brightness(103%) contrast(87%);
  transition: filter var(--transition-normal);
}
.footer__social-link:hover .footer__social-icon {
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
}
.footer__legal {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}
.footer__legal-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-normal);
}
.footer__legal-link:hover {
  color: var(--color-text);
}
.footer__copyright {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}
@media (max-width: 768px) {
  .footer__links {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  .footer__legal {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style> 