// useSeo.js
// 全局 SEO 工具，動態設置多語言 meta、og、hreflang、canonical
import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

/**
 * @param {Object} seo - { title, description, image, canonical, alternates }
 * @param {string} seo.title
 * @param {string} seo.description
 * @param {string} [seo.image]
 * @param {string} [seo.canonical]
 * @param {Object} [seo.alternates] - { 'en': '/en/xxx', 'zh-tw': '/zh-tw/xxx' }
 */
export function useSeo(seo) {
  const { locale, t } = useI18n();
  const route = useRoute();

  watchEffect(() => {
    // title
    document.title = typeof seo.title === 'function' ? seo.title(t, locale.value) : t(seo.title);
    // description
    setMeta('description', typeof seo.description === 'function' ? seo.description(t, locale.value) : t(seo.description));
    // og:title/desc
    setMeta('og:title', document.title, true);
    setMeta('og:description', getMeta('description'), true);
    // og:image
    if (seo.image) setMeta('og:image', seo.image, true);
    // canonical
    setLink('canonical', seo.canonical || window.location.origin + route.fullPath);
    // hreflang
    if (seo.alternates) {
      Object.entries(seo.alternates).forEach(([lang, href]) => {
        setLink('alternate', window.location.origin + href, lang);
      });
    }
  });
}

function setMeta(name, content, property = false) {
  let el = document.head.querySelector(`${property ? 'meta[property="og:' + name.replace('og:', '') + '"]' : 'meta[name="' + name + '"]'}`);
  if (!el) {
    el = document.createElement('meta');
    if (property) el.setAttribute('property', name);
    else el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
function getMeta(name) {
  const el = document.head.querySelector(`meta[name="${name}"]`);
  return el ? el.getAttribute('content') : '';
}
function setLink(rel, href, hreflang) {
  let el = document.head.querySelector(`link[rel="${rel}"]${hreflang ? `[hreflang="${hreflang}"]` : ''}`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
} 