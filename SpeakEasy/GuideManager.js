class GuideManager {
  constructor() {
    this.currentStep = 0;
    this.steps = [
      {
        id: 'welcome',
        element: null,
        title: 'welcome_title',
        content: 'welcome_content',
        position: 'center',
        highlightElement: false
      },
      {
        id: 'select-text',
        element: 'body',
        title: 'select_text_title',
        content: 'guide_select_text',
        position: 'right',
        highlightElement: true
      },
      {
        id: 'player-controls',
        element: '.player-controls',
        title: 'player_controls_title',
        content: 'guide_player_controls',
        position: 'bottom',
        highlightElement: true
      }
    ];
    
    // 添加跳过教程选项
    this.canSkip = true;
  }

  start() {
    chrome.storage.sync.get('hasCompletedGuide', (result) => {
      if (!result.hasCompletedGuide) {
        this.createOverlay();
        this.showStep(0);
      }
    });
  }

  // 添加遮罩层，突出显示引导元素
  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'speakeasy-guide-overlay';
    document.body.appendChild(overlay);
  }

  showStep(index) {
    const step = this.steps[index];
    const tooltip = document.createElement('div');
    tooltip.className = 'speakeasy-guide-tooltip';
    
    // 添加更专业的UI设计
    tooltip.innerHTML = `
      <div class="guide-content">
        <div class="guide-progress-indicator">
          ${this.steps.map((_, i) => 
            `<span class="progress-dot ${i === index ? 'active' : ''}"></span>`
          ).join('')}
        </div>
        <h4>${chrome.i18n.getMessage(step.title) || step.title}</h4>
        <p>${chrome.i18n.getMessage(step.content) || step.content}</p>
        <div class="guide-buttons">
          ${this.canSkip ? `<button class="guide-skip">${chrome.i18n.getMessage('skip_tutorial')}</button>` : ''}
          ${index > 0 ? `<button class="guide-prev">${chrome.i18n.getMessage('previous')}</button>` : ''}
          <button class="guide-next">${index < this.steps.length - 1 ? chrome.i18n.getMessage('next') : chrome.i18n.getMessage('finish')}</button>
        </div>
      </div>
    `;

    document.body.appendChild(tooltip);
    
    // 高亮引导元素
    if (step.highlightElement && step.element) {
      const targetElement = document.querySelector(step.element);
      if (targetElement) {
        targetElement.classList.add('speakeasy-highlight');
      }
    }
    
    this.positionTooltip(tooltip, step);
    this.addTooltipListeners(tooltip, index);
  }

  positionTooltip(tooltip, step) {
    if (step.position === 'center') {
      tooltip.style.left = '50%';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
    } else if (step.element) {
      const target = document.querySelector(step.element);
      if (target) {
        const rect = target.getBoundingClientRect();
        
        switch (step.position) {
          case 'right':
            tooltip.style.left = `${rect.right + 10}px`;
            tooltip.style.top = `${rect.top}px`;
            break;
          case 'bottom':
            tooltip.style.left = `${rect.left}px`;
            tooltip.style.top = `${rect.bottom + 10}px`;
            break;
          case 'left':
            tooltip.style.left = `${rect.left - tooltip.offsetWidth - 10}px`;
            tooltip.style.top = `${rect.top}px`;
            break;
          case 'top':
            tooltip.style.left = `${rect.left}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            break;
        }
      }
    }
    
    // 确保工具提示不超出视窗
    const tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
      tooltip.style.left = `${window.innerWidth - tooltipRect.width - 20}px`;
    }
    if (tooltipRect.bottom > window.innerHeight) {
      tooltip.style.top = `${window.innerHeight - tooltipRect.height - 20}px`;
    }
  }

  addTooltipListeners(tooltip, index) {
    const nextBtn = tooltip.querySelector('.guide-next');
    const prevBtn = tooltip.querySelector('.guide-prev');
    const skipBtn = tooltip.querySelector('.guide-skip');

    nextBtn.addEventListener('click', () => {
      this.removeHighlights();
      tooltip.remove();
      
      if (index < this.steps.length - 1) {
        this.showStep(index + 1);
      } else {
        this.complete();
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.removeHighlights();
        tooltip.remove();
        this.showStep(index - 1);
      });
    }
    
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.removeHighlights();
        tooltip.remove();
        this.complete();
      });
    }
  }
  
  removeHighlights() {
    document.querySelectorAll('.speakeasy-highlight').forEach(el => {
      el.classList.remove('speakeasy-highlight');
    });
  }

  complete() {
    document.querySelector('.speakeasy-guide-overlay')?.remove();
    chrome.storage.sync.set({ hasCompletedGuide: true });
  }
} 