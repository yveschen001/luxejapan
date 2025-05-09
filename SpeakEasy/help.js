document.addEventListener('DOMContentLoaded', () => {
  // 本地化界面文本
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = chrome.i18n.getMessage(key);
    if (translation) {
      element.textContent = translation;
    }
  });
}); 