class SpeakEasyPlayer {
  constructor() {
    this.container = null;
    this.isPlaying = false;
    this.progress = 0;
    this.isDragging = false;
    this.currentStyle = 'default';
    this.opacity = 1;
    this.currentX = 0;
    this.currentY = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    
    this.init();
  }
  
  init() {
    this.createContainer();
    this.loadSettings();
    this.addEventListeners();
  }
  
  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'speakeasy-player';
    this.container.innerHTML = `
      <div class="player-header" title="${chrome.i18n.getMessage("drag_to_move")}">
        <img src="images/logo.png" alt="SpeakEasy - Web Reader" class="player-logo">
        <span class="player-title">SpeakEasy - Web Reader</span>
      </div>
      <div class="player-controls">
        <button class="player-button" id="playPauseBtn" title="${chrome.i18n.getMessage("tooltip_play")}">
          ${this.getPlayPauseIcon()}
        </button>
        <button class="player-button" id="stopBtn" title="${chrome.i18n.getMessage("tooltip_stop")}">
          ${this.getStopIcon()}
        </button>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: 0%"></div>
        </div>
      </div>
      <div class="settings-panel">
        <select id="voiceSelect"></select>
        <input type="range" id="speedControl" min="0.5" max="2" step="0.1" value="1">
        <input type="range" id="volumeControl" min="0" max="1" step="0.1" value="1">
      </div>
    `;
    
    document.body.appendChild(this.container);
    
    // 添加基本样式
    const style = document.createElement('style');
    style.textContent = `
      #floating-player {
        position: fixed;
        z-index: 10000;
        padding: 10px;
        border-radius: 8px;
        cursor: move;
        transition: background-color 0.3s;
        min-width: 200px;
      }
      
      .player-controls {
        display: flex;
        gap: 8px;
      }
      
      .player-button {
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }
  
  getPlayPauseIcon() {
    return this.isPlaying ? `
      <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24">
        <path d="M8 5c0-0.55 0.45-1 1-1h2c0.55 0 1 0.45 1 1v14c0 0.55-0.45 1-1 1H9c-0.55 0-1-0.45-1-1V5z"/>
        <path d="M14 5c0-0.55 0.45-1 1-1h2c0.55 0 1 0.45 1 1v14c0 0.55-0.45 1-1 1h-2c-0.55 0-1-0.45-1-1V5z"/>
      </svg>
    ` : `
      <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24">
        <path d="M8 5.76C8 5.12 8.76 4.75 9.28 5.11l8.92 6.24c0.47 0.33 0.47 1.02 0 1.35l-8.92 6.24C8.76 19.25 8 18.88 8 18.24V5.76z"/>
      </svg>
    `;
  }
  
  updatePlayPauseButton() {
    const btn = this.container.querySelector('#playPauseBtn');
    btn.innerHTML = this.getPlayPauseIcon();
    btn.title = chrome.i18n.getMessage(this.isPlaying ? "tooltip_pause" : "tooltip_play");
    btn.className = `player-button ${this.isPlaying ? 'playing' : 'paused'}`;
  }
  
  updateProgress(percent) {
    this.progress = percent;
    this.container.querySelector('.progress-bar-fill').style.width = `${percent}%`;
  }
  
  setStyle(style) {
    this.currentStyle = style;
    this.container.className = `floating-player ${style}`;
  }
  
  setOpacity(opacity) {
    this.opacity = opacity;
    this.container.style.opacity = opacity;
  }
  
  loadSettings() {
    chrome.storage.sync.get(['playerStyle', 'opacity', 'position'], (result) => {
      this.applyStyle(result.playerStyle || 'default');
      this.setOpacity(result.opacity || 1);
      if (result.position) {
        this.setPosition(result.position.x, result.position.y);
      } else {
        this.setPosition(20, 20);
      }
    });
  }
  
  applyStyle(style) {
    this.container.className = '';
    this.container.classList.add(`player-${style}`);
  }
  
  setPosition(x, y) {
    const maxX = window.innerWidth - this.container.offsetWidth;
    const maxY = window.innerHeight - this.container.offsetHeight;
    
    this.xOffset = Math.min(Math.max(0, x), maxX);
    this.yOffset = Math.min(Math.max(0, y), maxY);
    
    this.container.style.transform = `translate(${this.xOffset}px, ${this.yOffset}px)`;
  }
  
  addEventListeners() {
    // 播放/暂停按钮
    this.container.querySelector('#playPauseBtn').addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      this.updatePlayPauseButton();
      this.emit(this.isPlaying ? 'play' : 'pause');
    });
    
    // 停止按钮
    this.container.querySelector('#stopBtn').addEventListener('click', () => {
      this.isPlaying = false;
      this.updatePlayPauseButton();
      this.updateProgress(0);
      this.emit('stop');
    });
    
    // 进度条点击
    const progressBar = this.container.querySelector('.progress-bar');
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      this.updateProgress(percent);
      this.emit('seek', percent);
    });
    
    // 控制器事件
    this.container.querySelector('#speedControl').addEventListener('input', (e) => {
      this.emit('speed-change', e.target.value);
    });
    
    this.container.querySelector('#volumeControl').addEventListener('input', (e) => {
      this.emit('volume-change', e.target.value);
    });
    
    this.container.addEventListener('mousedown', this.dragStart.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.dragEnd.bind(this));
    window.addEventListener('resize', () => {
      this.setPosition(this.xOffset, this.yOffset);
    });
  }
  
  dragStart(e) {
    if (e.target.closest('.player-controls')) {
      return;
    }
    
    this.initialX = e.clientX - this.xOffset;
    this.initialY = e.clientY - this.yOffset;
    this.isDragging = true;
  }
  
  drag(e) {
    if (this.isDragging) {
      e.preventDefault();
      
      this.currentX = e.clientX - this.initialX;
      this.currentY = e.clientY - this.initialY;
      
      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      
      this.setPosition(this.currentX, this.currentY);
    }
  }
  
  dragEnd() {
    if (this.isDragging) {
      this.isDragging = false;
      
      // 保存位置
      chrome.storage.sync.set({
        position: {
          x: this.xOffset,
          y: this.yOffset
        }
      });
    }
  }
  
  // 添加最小化功能
  toggleMinimize() {
    this.container.classList.toggle('minimized');
    this.saveSettings();
  }
  
  // 添加错误提示
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    this.container.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
  
  // 添加键盘快捷键
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      switch(e.key) {
        case ' ':
          e.preventDefault();
          this.togglePlayPause();
          break;
        case 'ArrowRight':
          if (e.ctrlKey) {
            e.preventDefault();
            this.nextParagraph();
          }
          break;
        // ... more shortcuts
      }
    });
  }
  
  emit(event, data) {
    // 发送消息给content script
    chrome.runtime.sendMessage({
      action: event,
      data: data
    });
  }
  
  showStatus(status) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `speakeasy-status ${status.type}`;
    statusDiv.textContent = chrome.i18n.getMessage(status.message);
    this.container.appendChild(statusDiv);
    
    setTimeout(() => statusDiv.remove(), 3000);
  }
  
  handleError(error) {
    console.error('SpeakEasy Error:', error);
    this.showStatus({
      type: 'error',
      message: error.messageKey || 'generic_error'
    });
  }
} 