class I18nManager {
  static init() {
    // 初始化所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = chrome.i18n.getMessage(key);
      
      if (translation) {
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  static formatMessage(key, substitutions = {}) {
    let message = chrome.i18n.getMessage(key);
    
    // 替换模板变量
    Object.entries(substitutions).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });
    
    return message;
  }
}

// 页面加载时初始化国际化
document.addEventListener('DOMContentLoaded', () => {
  I18nManager.init();
}); 