class SpeakEasyPlayer {
  constructor() {
    this.container = null;
    this.isPlaying = false;
    this.currentText = '';
    this.utterance = null;
    this.maxTextLength = 5000; // 设置最大文本长度
    this.init();
  }

  init() {
    this.createPlayer();
    this.loadSettings();
    this.setupSpeech();
    this.setupKeyboardShortcuts();
    this.checkSpeechSynthesisState();
  }

  createPlayer() {
    this.container = document.createElement('div');
    this.container.className = 'speakeasy-player';
    this.container.innerHTML = `
      <div class="player-header" title="${chrome.i18n.getMessage("drag_to_move")}">
        <div class="player-title-area">
          <svg class="player-logo" width="16" height="16" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
          </svg>
          <span class="player-title">SpeakEasy</span>
        </div>
        <div class="player-controls-mini">
          <button class="player-button minimize-btn" title="${chrome.i18n.getMessage("tooltip_minimize")}">
            <svg width="12" height="12" viewBox="0 0 24 24">
              <path d="M19 13H5v-2h14v2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="player-body">
        <div class="progress-bar">
          <div class="progress-fill"></div>
          <div class="progress-indicator"></div>
        </div>
        <div class="player-controls-main">
          <button class="player-button play-btn" title="${chrome.i18n.getMessage("tooltip_play")}">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
          </button>
          <button class="player-button stop-btn" title="${chrome.i18n.getMessage("tooltip_stop")}">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" fill="currentColor"/>
            </svg>
          </button>
          <div class="player-settings-mini">
            <button class="player-button settings-toggle" title="${chrome.i18n.getMessage("settings")}">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="player-settings">
          <div class="settings-row">
            <label>${chrome.i18n.getMessage("voice_label")}</label>
            <select class="voice-select"></select>
          </div>
          <div class="settings-row">
            <label>${chrome.i18n.getMessage("speed_label")}</label>
            <div class="range-control">
              <input type="range" class="speed-control" min="0.5" max="2" step="0.1" value="1">
              <span class="speed-value">1.0</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.container);
    this.addEventListeners();
  }

  checkBrowserSupport() {
    if (!('speechSynthesis' in window)) {
      this.showWarning('browser_not_supported');
      return false;
    }
    return true;
  }

  setupSpeech() {
    if (!this.checkBrowserSupport()) return;

    // 语音列表可能初始加载为空，需要处理这种情况
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const voiceSelect = this.container.querySelector('.voice-select');
      
      if (!voices || voices.length === 0) {
        // 如果语音列表为空，显示加载中状态
        voiceSelect.innerHTML = `<option value="" disabled>${chrome.i18n.getMessage("loading_voices")}</option>`;
        
        // 在某些浏览器中，可能需要延迟再次尝试
        setTimeout(() => {
          if (speechSynthesis.getVoices().length > 0) {
            this.populateVoiceList();
          } else {
            this.showWarning('no_voices_available');
          }
        }, 1000);
        return;
      }
      
      this.populateVoiceList();
    };

    // 检查是否需要等待voices加载
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
  }

  populateVoiceList() {
    const voices = speechSynthesis.getVoices();
    const voiceSelect = this.container.querySelector('.voice-select');
    
    if (!voices.length) {
      voiceSelect.innerHTML = `<option value="" disabled>${chrome.i18n.getMessage("no_voices_available")}</option>`;
      return;
    }
    
    voiceSelect.innerHTML = '';
    
    // 按语言和质量分组
    const voicesByLang = {};
    voices.forEach(voice => {
      const langCode = voice.lang.split('-')[0];
      if (!voicesByLang[langCode]) {
        voicesByLang[langCode] = [];
      }
      voicesByLang[langCode].push(voice);
    });
    
    // 当前语言优先
    const userLang = navigator.language.split('-')[0];
    const langOrder = [userLang];
    
    // 添加其他语言
    Object.keys(voicesByLang)
      .filter(lang => lang !== userLang)
      .sort()
      .forEach(lang => langOrder.push(lang));
    
    // 创建语言分组
    langOrder.forEach(langCode => {
      if (!voicesByLang[langCode]) return;
      
      let langName;
      try {
        langName = new Intl.DisplayNames([navigator.language], {type: 'language'}).of(langCode);
      } catch (e) {
        langName = langCode;
      }
      
      const optgroup = document.createElement('optgroup');
      optgroup.label = langName;
      
      // 按名称排序
      voicesByLang[langCode]
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(voice => {
          const option = document.createElement('option');
          option.value = voice.name;
          option.textContent = voice.name;
          optgroup.appendChild(option);
        });
      
      voiceSelect.appendChild(optgroup);
    });
    
    // 设置默认语音
    this.setDefaultVoice(userLang);
  }

  setDefaultVoice(userLang) {
    const voices = speechSynthesis.getVoices();
    const voiceSelect = this.container.querySelector('.voice-select');
    
    // 首先尝试使用保存的设置
    chrome.storage.sync.get(['voiceSettings'], (result) => {
      if (result.voiceSettings?.voiceName) {
        voiceSelect.value = result.voiceSettings.voiceName;
        return;
      }
      
      // 否则使用系统语言的默认语音
      const defaultVoice = voices.find(voice => 
        voice.lang.startsWith(userLang) && voice.default
      ) || voices.find(voice => 
        voice.lang.startsWith(userLang)
      );
      
      if (defaultVoice) {
        voiceSelect.value = defaultVoice.name;
      }
    });
  }

  speak(text) {
    // 添加文本长度检查
    if (text.length > this.maxTextLength) {
      this.showWarning('text_too_long', {
        current: text.length,
        max: this.maxTextLength
      });
      // 自动截取文本
      text = text.substring(0, this.maxTextLength);
    }

    if (!text.trim()) {
      this.showWarning('empty_text');
      return;
    }

    if (this.utterance) {
      speechSynthesis.cancel();
    }

    this.currentText = text;
    this.utterance = new SpeechSynthesisUtterance(text);
    
    const voiceSelect = this.container.querySelector('.voice-select');
    const speedControl = this.container.querySelector('.speed-control');
    
    // 获取选中的语音
    const selectedVoice = speechSynthesis.getVoices().find(v => v.name === voiceSelect.value);
    
    if (selectedVoice) {
      this.utterance.voice = selectedVoice;
    } else {
      // 如果找不到选择的语音，显示警告
      this.showWarning('voice_not_found');
    }
    
    this.utterance.rate = parseFloat(speedControl.value);
    
    // 添加错误处理
    this.utterance.onerror = (event) => {
      this.handleSpeechError(event);
    };
    
    this.utterance.onboundary = this.updateProgress.bind(this);
    this.utterance.onend = () => {
      this.isPlaying = false;
      this.updatePlayButton();
      // 更新进度条为完成状态
      this.container.querySelector('.progress-fill').style.width = '100%';
      
      // 延迟重置进度条，让用户看到完成状态
      setTimeout(() => {
        this.container.querySelector('.progress-fill').style.width = '0%';
      }, 1000);
    };

    try {
      speechSynthesis.speak(this.utterance);
      this.isPlaying = true;
      this.updatePlayButton();
      this.container.classList.remove('minimized'); // 确保播放时显示完整播放器
    } catch (error) {
      this.handleSpeechError(error);
    }
  }

  updateProgress(event) {
    if (event.charIndex) {
      const progress = (event.charIndex / this.currentText.length) * 100;
      this.container.querySelector('.progress-fill').style.width = `${progress}%`;
    }
  }

  updatePlayButton() {
    const playBtn = this.container.querySelector('.play-btn');
    // 添加更多动画和反馈
    if (this.isPlaying) {
      playBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
        </svg>
      `;
      playBtn.classList.add('playing');
      playBtn.title = chrome.i18n.getMessage("tooltip_pause");
      this.container.classList.add('is-playing');
    } else {
      playBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" fill="currentColor"/>
        </svg>
      `;
      playBtn.classList.remove('playing');
      playBtn.title = chrome.i18n.getMessage("tooltip_play");
      this.container.classList.remove('is-playing');
    }
  }

  addEventListeners() {
    // 播放/暂停
    this.container.querySelector('.play-btn').addEventListener('click', () => {
      if (this.isPlaying) {
        speechSynthesis.pause();
      } else {
        speechSynthesis.resume();
      }
      this.isPlaying = !this.isPlaying;
      this.updatePlayButton();
    });

    // 停止
    this.container.querySelector('.stop-btn').addEventListener('click', () => {
      speechSynthesis.cancel();
      this.isPlaying = false;
      this.updatePlayButton();
      this.container.querySelector('.progress-fill').style.width = '0%';
    });

    // 最小化
    this.container.querySelector('.minimize-btn').addEventListener('click', () => {
      this.container.classList.toggle('minimized');
    });

    // 拖动功能
    this.makeDraggable();

    // 添加进度条点击跳转
    this.container.querySelector('.progress-bar').addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const position = Math.floor(this.currentText.length * percent);
      
      if (this.utterance) {
        speechSynthesis.cancel();
        this.speak(this.currentText.substring(position));
      }
    });

    // 改进键盘快捷键处理
    this.setupKeyboardShortcuts();

    // 保存设置变更
    this.container.querySelector('.voice-select').addEventListener('change', () => {
      this.saveSettings();
    });
    
    this.container.querySelector('.speed-control').addEventListener('change', () => {
      this.saveSettings();
    });

    // 添加速度值显示更新
    const speedControl = this.container.querySelector('.speed-control');
    const speedValue = this.container.querySelector('.speed-value');
    
    speedControl.addEventListener('input', () => {
      speedValue.textContent = speedControl.value;
    });

    // 设置菜单切换
    this.container.querySelector('.settings-toggle').addEventListener('click', () => {
      this.container.querySelector('.player-settings').classList.toggle('visible');
    });
    
    // 点击播放器外部关闭设置面板
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.container.querySelector('.player-settings').classList.remove('visible');
      }
    });
  }

  makeDraggable() {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    this.container.querySelector('.player-header').addEventListener('mousedown', e => {
      isDragging = true;
      initialX = e.clientX - this.container.offsetLeft;
      initialY = e.clientY - this.container.offsetTop;
      this.container.style.transition = 'none'; // 拖动时禁用过渡效果
    });

    document.addEventListener('mousemove', e => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        // 添加窗口边界检查
        const maxX = window.innerWidth - this.container.offsetWidth;
        const maxY = window.innerHeight - this.container.offsetHeight;
        
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));
        
        this.container.style.left = `${currentX}px`;
        this.container.style.top = `${currentY}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        this.container.style.transition = 'all 0.3s ease'; // 恢复过渡效果
        this.saveSettings(); // 保存新位置
      }
    });
    
    // 添加窗口大小变化的监听
    window.addEventListener('resize', () => {
      const rect = this.container.getBoundingClientRect();
      
      // 如果播放器超出窗口边界，重新定位
      if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
        const newLeft = Math.min(rect.left, window.innerWidth - this.container.offsetWidth);
        const newTop = Math.min(rect.top, window.innerHeight - this.container.offsetHeight);
        
        this.container.style.left = `${Math.max(0, newLeft)}px`;
        this.container.style.top = `${Math.max(0, newTop)}px`;
        this.saveSettings();
      }
    });
  }

  // 添加警告提示功能
  showWarning(messageKey, substitutions = {}) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'speakeasy-warning';
    
    let message = chrome.i18n.getMessage(messageKey);
    Object.entries(substitutions).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });
    
    warningDiv.textContent = message;
    this.container.appendChild(warningDiv);
    
    setTimeout(() => {
      warningDiv.remove();
    }, 5000);
  }

  // 添加设置保存功能
  saveSettings() {
    const settings = {
      voice: this.container.querySelector('.voice-select').value,
      speed: this.container.querySelector('.speed-control').value,
      position: {
        left: this.container.style.left,
        top: this.container.style.top
      }
    };
    
    chrome.storage.sync.set({ playerSettings: settings });
  }

  // 添加设置加载功能
  loadSettings() {
    chrome.storage.sync.get('playerSettings', (result) => {
      if (result.playerSettings) {
        const { voice, speed, position } = result.playerSettings;
        
        if (voice) {
          this.container.querySelector('.voice-select').value = voice;
        }
        if (speed) {
          this.container.querySelector('.speed-control').value = speed;
        }
        if (position) {
          this.container.style.left = position.left;
          this.container.style.top = position.top;
        }
      }
    });
  }

  handleSpeechError(error) {
    console.error('Speech error:', error);
    this.showWarning('speech_error');
    this.isPlaying = false;
    this.updatePlayButton();
  }

  // 添加恢复播放状态的功能
  resumePlaybackIfNeeded() {
    chrome.storage.local.get('playbackState', (result) => {
      if (result.playbackState && result.playbackState.wasPlaying) {
        const { text, position, voice, speed } = result.playbackState;
        
        if (text) {
          // 设置语音和速度
          if (voice) {
            this.container.querySelector('.voice-select').value = voice;
          }
          if (speed) {
            this.container.querySelector('.speed-control').value = speed;
            this.container.querySelector('.speed-value').textContent = speed;
          }
          
          // 从保存的位置继续播放
          if (position && position < text.length) {
            this.speak(text.substring(position));
          } else {
            this.speak(text);
          }
        }
      }
    });
  }

  // 保存播放状态
  savePlaybackState() {
    if (!this.isPlaying || !this.currentText) return;
    
    // 获取当前位置（通过进度条估算）
    const progressFill = this.container.querySelector('.progress-fill');
    const progress = parseFloat(progressFill.style.width) / 100;
    const position = Math.floor(this.currentText.length * progress);
    
    chrome.storage.local.set({
      playbackState: {
        wasPlaying: this.isPlaying,
        text: this.currentText,
        position: position,
        voice: this.container.querySelector('.voice-select').value,
        speed: this.container.querySelector('.speed-control').value
      }
    });
  }

  // 改进键盘快捷键处理
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // 忽略在输入框中的按键
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
      
      // 确保没有按下修饰键
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
        return;
      }
      
      switch(e.key) {
        case ' ': // 空格键 - 播放/暂停
          e.preventDefault(); // 防止页面滚动
          if (this.isPlaying) {
            speechSynthesis.pause();
            this.isPlaying = false;
          } else if (this.utterance) {
            speechSynthesis.resume();
            this.isPlaying = true;
          }
          this.updatePlayButton();
          break;
          
        case 'Escape': // Esc键 - 停止
          speechSynthesis.cancel();
          this.isPlaying = false;
          this.updatePlayButton();
          this.container.querySelector('.progress-fill').style.width = '0%';
          break;
      }
    });
  }

  // 添加语音合成状态检查
  checkSpeechSynthesisState() {
    // WebSpeech API有时会在后台暂停，这里定期检查并恢复
    setInterval(() => {
      if (this.isPlaying && speechSynthesis.speaking && speechSynthesis.paused) {
        speechSynthesis.resume();
      }
    }, 1000);
  }

  showNotification(type, messageKey, substitutions = {}) {
    const notification = document.createElement('div');
    notification.className = `speakeasy-notification ${type}`;
    
    let message = chrome.i18n.getMessage(messageKey);
    Object.entries(substitutions).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });
    
    // 添加图标和状态图标
    let icon = '';
    switch (type) {
      case 'success':
        icon = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>';
        break;
      case 'warning':
        icon = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/></svg>';
        break;
      case 'error':
        icon = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>';
        break;
      case 'info':
        icon = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>';
        break;
    }
    
    notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-message">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // 设置自动消失
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
} 