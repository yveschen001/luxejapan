document.addEventListener('DOMContentLoaded', () => {
  // 加载已保存的设置
  chrome.storage.sync.get(['apiKey', 'voice'], (items) => {
    if (items.apiKey) {
      document.getElementById('apiKey').value = items.apiKey;
    }
    if (items.voice) {
      document.getElementById('voice').value = items.voice;
    }
  });

  document.getElementById('saveSettings').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    const voice = document.getElementById('voice').value;

    if (!apiKey) {
      alert(chrome.i18n.getMessage('error_no_api_key'));
      return;
    }

    chrome.storage.sync.set({
      apiKey: apiKey,
      voice: voice,
      hasCompletedOnboarding: true
    }, () => {
      const status = document.getElementById('status');
      status.textContent = chrome.i18n.getMessage('settings_saved');
      setTimeout(() => {
        window.close();
      }, 1500);
    });
  });
}); 