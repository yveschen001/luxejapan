document.addEventListener('DOMContentLoaded', () => {
  console.log('初始化 SpeakEasy 弹出窗口...');
  
  // 获取DOM元素
  const voiceSelect = document.getElementById('voice');
  const speedInput = document.getElementById('speed');
  const speedValue = document.getElementById('speedValue');
  const volumeInput = document.getElementById('volume');
  const volumeValue = document.getElementById('volumeValue');
  const readPageButton = document.getElementById('readPage');
  const stopReadingButton = document.getElementById('stopReading');
  const openHelpLink = document.getElementById('openHelp');
  const statusElement = document.getElementById('status');
  
  // 验证DOM元素已正确获取
  const elements = {
    voiceSelect, speedInput, speedValue, volumeInput, 
    volumeValue, readPageButton, stopReadingButton, openHelpLink, statusElement
  };
  
  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`找不到元素: ${name}`);
    }
  }
  
  // 初始化语音引擎
  let voices = [];
  let voicesInitialized = false;
  
  // 显示状态消息
  function showStatus(message, type = 'info') {
    if (!statusElement) return;
    
    statusElement.textContent = message;
    statusElement.style.display = 'block';
    
    // 设置样式
    switch(type) {
      case 'error':
        statusElement.style.backgroundColor = '#fce8e6';
        statusElement.style.color = '#c5221f';
        break;
      case 'warning':
        statusElement.style.backgroundColor = '#fef7e0';
        statusElement.style.color = '#e37400';
        break;
      case 'success':
        statusElement.style.backgroundColor = '#e6f4ea';
        statusElement.style.color = '#137333';
        break;
      default:
        statusElement.style.backgroundColor = '#e8f0fe';
        statusElement.style.color = '#1a73e8';
    }
    
    // 3秒后自动隐藏
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }
  
  // 加载语音
  function loadVoices() {
    console.log('开始加载语音引擎...');
    
    if (!window.speechSynthesis) {
      console.error('浏览器不支持语音合成API');
      showStatus('浏览器不支持语音合成功能', 'error');
      return;
    }
    
    // 强制刷新语音引擎
    window.speechSynthesis.cancel();
    
    // 添加加载提示
    if (voiceSelect) {
      voiceSelect.innerHTML = '<option disabled>正在加载语音...</option>';
    }
    
    // 获取语音列表
    voices = window.speechSynthesis.getVoices();
    console.log('当前可用语音数量:', voices.length);
    
    if (voices.length > 0) {
      console.log('语音列表:', voices.map(v => `${v.name} (${v.lang})`));
      voicesInitialized = true;
      populateVoiceList();
    } else {
      // 设置更长的超时时间和重试次数
      let attempts = 0;
      const maxAttempts = 5; // 增加重试次数
      
      const checkVoices = () => {
        voices = window.speechSynthesis.getVoices();
        console.log(`第 ${attempts + 1} 次尝试加载语音，当前数量:`, voices.length);
        
        if (voices.length > 0) {
          voicesInitialized = true;
          populateVoiceList();
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(checkVoices, 1500); // 增加等待时间
          } else {
            console.error('无法加载语音引擎');
            showStatus('无法加载语音引擎，请检查系统语音设置', 'error');
          }
        }
      };
      
      // 监听语音列表变化
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('语音列表已更新');
        if (!voicesInitialized) {
          checkVoices();
        }
      };
      
      // 开始首次检查
      setTimeout(checkVoices, 1000);
    }
  }
  
  // 填充语音下拉列表
  function populateVoiceList() {
    if (!voiceSelect) return;
    
    // 清空现有选项
    voiceSelect.innerHTML = '';
    
    // 获取浏览器语言
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    
    // 只保留中文和英文语音
    const supportedLanguages = ['zh', 'en'];
    
    // 按语言分组
    const voicesByLang = {};
    voices.forEach(voice => {
      const langCode = voice.lang.split('-')[0].toLowerCase();
      if (supportedLanguages.includes(langCode)) {
        if (!voicesByLang[langCode]) {
          voicesByLang[langCode] = [];
        }
        voicesByLang[langCode].push(voice);
      }
    });
    
    // 优先显示浏览器语言对应的语音
    const orderedLangs = [
      browserLang,
      ...supportedLanguages.filter(lang => lang !== browserLang)
    ];
    
    let voiceFound = false;
    
    orderedLangs.forEach(langCode => {
      if (!voicesByLang[langCode]) return;
      
      const langVoices = voicesByLang[langCode];
      if (langVoices.length === 0) return;
      
      // 创建语言分组
      const optgroup = document.createElement('optgroup');
      optgroup.label = langCode === 'zh' ? '中文' : 'English';
      
      // 添加语音选项
      langVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = voice.name;
        option.setAttribute('data-lang', voice.lang);
        optgroup.appendChild(option);
        voiceFound = true;
      });
      
      voiceSelect.appendChild(optgroup);
    });
    
    if (!voiceFound) {
      voiceSelect.innerHTML = '<option disabled>未找到可用语音</option>';
      showStatus('未找到可用语音引擎', 'error');
    } else {
      // 加载保存的设置
      loadSettings();
      showStatus(`已加载可用语音`, 'success');
    }
  }
  
  // 加载保存的设置
  function loadSettings() {
    chrome.storage.sync.get('voiceSettings', (result) => {
      // 语音设置
      if (result.voiceSettings) {
        const settings = result.voiceSettings;
        
        // 设置声音
        if (voiceSelect && settings.voiceName) {
          // 检查声音是否存在
          const voiceExists = Array.from(voiceSelect.options).some(
            option => option.value === settings.voiceName
          );
          
          if (voiceExists) {
            voiceSelect.value = settings.voiceName;
          } else {
            console.log(`保存的声音 "${settings.voiceName}" 不可用`);
          }
        }
        
        // 设置语速
        if (speedInput && settings.speed) {
          speedInput.value = settings.speed;
          if (speedValue) speedValue.textContent = settings.speed;
        }
        
        // 设置音量
        if (volumeInput && settings.volume) {
          volumeInput.value = settings.volume;
          if (volumeValue) volumeValue.textContent = settings.volume;
        }
      }
    });
  }
  
  // 保存设置
  function saveVoiceSettings() {
    const settings = {
      voiceName: voiceSelect ? voiceSelect.value : null,
      speed: speedInput ? speedInput.value : 1.0,
      volume: volumeInput ? volumeInput.value : 1.0
    };
    
    chrome.storage.sync.set({ voiceSettings: settings }, () => {
      console.log('语音设置已保存');
    });
  }
  
  // 发送消息到当前选项卡
  function sendMessageToActiveTab(message) {
    // 获取当前语音设置
    const currentSettings = {
      voiceName: voiceSelect ? voiceSelect.value : null,
      speed: speedInput ? parseFloat(speedInput.value) : 1.0,
      volume: volumeInput ? parseFloat(volumeInput.value) : 1.0
    };
    
    // 合并消息和设置
    const messageWithSettings = {
      ...message,
      voiceSettings: currentSettings
    };
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs[0]) {
        console.error('找不到活动选项卡');
        showStatus('无法找到当前网页', 'error');
        return;
      }
      
      try {
        chrome.tabs.sendMessage(tabs[0].id, messageWithSettings, (response) => {
          if (chrome.runtime.lastError) {
            console.log('发送消息失败，尝试通过background发送...');
            
            chrome.runtime.sendMessage({
              ...messageWithSettings,
              target: 'background',
              tabId: tabs[0].id
            }, response => {
              if (chrome.runtime.lastError) {
                console.error('通过background发送消息失败:', chrome.runtime.lastError.message);
                showStatus('无法与页面通信，请刷新页面后重试', 'error');
              } else if (response && response.status) {
                handleResponse(response);
              }
            });
          } else if (response && response.status) {
            handleResponse(response);
          }
        });
      } catch (error) {
        console.error('发送消息时发生异常:', error);
        showStatus('发送消息时出错', 'error');
      }
    });
  }
  
  // 处理响应
  function handleResponse(response) {
    console.log('页面响应:', response.status);
    
    if (response.status === 'started') {
      showStatus('开始朗读页面', 'success');
    } else if (response.status === 'stopped') {
      showStatus('已停止朗读', 'info');
    } else if (response.status === 'error') {
      showStatus(response.message || '发生错误', 'error');
    }
  }
  
  // 检查API状态
  function checkAPIStatus() {
    // 检查Web Speech API
    if (!('speechSynthesis' in window)) {
      console.error('浏览器不支持Web Speech API');
      showStatus('浏览器不支持语音合成功能', 'error');
      return false;
    }
    
    console.log('Web Speech API 可用');
    return true;
  }
  
  // 事件监听器
  
  // 开始朗读
  if (readPageButton) {
    readPageButton.addEventListener('click', () => {
      sendMessageToActiveTab({action: 'readPage'});
      window.close();
    });
  }
  
  // 停止朗读
  if (stopReadingButton) {
    stopReadingButton.addEventListener('click', () => {
      sendMessageToActiveTab({action: 'stopReading'});
      window.close();
    });
  }
  
  // 语音选择
  if (voiceSelect) {
    voiceSelect.addEventListener('change', saveVoiceSettings);
  }
  
  // 语速调整
  if (speedInput) {
    speedInput.addEventListener('input', () => {
      if (speedValue) speedValue.textContent = speedInput.value;
    });
    
    speedInput.addEventListener('change', saveVoiceSettings);
  }
  
  // 音量调整
  if (volumeInput) {
    volumeInput.addEventListener('input', () => {
      if (volumeValue) volumeValue.textContent = volumeInput.value;
    });
    
    volumeInput.addEventListener('change', saveVoiceSettings);
  }
  
  // 打开帮助
  if (openHelpLink) {
    openHelpLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({
        url: chrome.runtime.getURL('help.html')
      });
    });
  }
  
  // 本地化界面文本
  function localizeUI() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = chrome.i18n.getMessage(key);
      if (translation) {
        element.textContent = translation;
      } else {
        console.log(`未找到翻译键 "${key}" 的翻译`);
      }
    });
  }
  
  // 获取用户语言并设置默认语音
  function setDefaultVoiceForLanguage() {
    // 获取浏览器语言
    const userLanguage = navigator.language.split('-')[0].toLowerCase();
    console.log('用户语言:', userLanguage);
    
    // 获取所有可用语音
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      console.log('等待语音加载...');
      window.speechSynthesis.onvoiceschanged = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        selectAppropriateVoice(availableVoices, userLanguage);
      };
    } else {
      selectAppropriateVoice(voices, userLanguage);
    }
  }
  
  // 选择合适的语音
  function selectAppropriateVoice(voices, userLanguage) {
    console.log(`为语言 ${userLanguage} 选择合适的语音`);
    
    // 首先检查是否有保存的设置
    chrome.storage.sync.get(['voiceSettings'], (result) => {
      if (result.voiceSettings && result.voiceSettings.voiceName) {
        console.log('使用已保存的语音设置');
        return;
      }
      
      // 没有保存的设置，查找合适的语音
      let selectedVoice = null;
      
      // 1. 首选：完全匹配用户语言的本地语音
      selectedVoice = voices.find(voice => 
        voice.lang.toLowerCase().startsWith(userLanguage) && voice.localService
      );
      
      // 2. 次选：完全匹配用户语言的任何语音
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.toLowerCase().startsWith(userLanguage)
        );
      }
      
      // 3. 备选：同语言族的语音
      if (!selectedVoice) {
        // 语言映射，处理相似语言
        const languageMap = {
          'zh': ['zh', 'yue', 'cmn'],  // 中文及方言
          'ja': ['ja'],                // 日语
          'ko': ['ko'],                // 韩语
          'en': ['en'],                // 英语
          // 可以添加更多语言映射
        };
        
        const similarLanguages = languageMap[userLanguage] || [userLanguage];
        selectedVoice = voices.find(voice => 
          similarLanguages.some(lang => voice.lang.toLowerCase().startsWith(lang))
        );
      }
      
      // 4. 最后备选：使用第一个可用的语音
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }
      
      if (selectedVoice) {
        console.log(`选择语音: ${selectedVoice.name} (${selectedVoice.lang})`);
        
        // 保存设置
        const settings = {
          voiceName: selectedVoice.name,
          speed: 1.0,
          volume: 1.0
        };
        
        chrome.storage.sync.set({ voiceSettings: settings }, () => {
          console.log('已保存默认语音设置');
          // 更新选择框
          const voiceSelect = document.getElementById('voice');
          if (voiceSelect) {
            voiceSelect.value = selectedVoice.name;
          }
        });
      } else {
        console.error('未找到合适的语音');
      }
    });
  }
  
  // 初始化
  if (checkAPIStatus()) {
    loadVoices();
  }
  
  // 设置默认语音
  setDefaultVoiceForLanguage();
  
  // 尝试本地化UI
  try {
    localizeUI();
  } catch (e) {
    console.error('本地化界面时出错:', e);
  }
  
  console.log('SpeakEasy 弹出窗口初始化完成');
}); 