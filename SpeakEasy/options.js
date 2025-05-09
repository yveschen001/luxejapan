document.getElementById('save').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey').value;
  const voice = document.getElementById('voice').value;
  
  chrome.storage.sync.set({
    apiKey: apiKey,
    voice: voice
  }, () => {
    const status = document.getElementById('status');
    status.textContent = '设置已保存';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
});

// 加载保存的设置
chrome.storage.sync.get(['apiKey', 'voice'], (items) => {
  if (items.apiKey) {
    document.getElementById('apiKey').value = items.apiKey;
  }
  if (items.voice) {
    document.getElementById('voice').value = items.voice;
  }
}); 