class GuideManager {
  constructor() {
    this.currentStep = 0;
    this.steps = [
      {
        id: 'welcome',
        element: null,
        title: 'welcome_title',
        content: 'welcome_content',
        position: 'center'
      },
      {
        id: 'select-text',
        element: 'body',
        title: 'select_text_title',
        content: 'select_text_guide',
        position: 'right'
      },
      {
        id: 'player-controls',
        element: '.player-controls',
        title: 'player_controls_title',
        content: 'player_controls_guide',
        position: 'bottom'
      },
      {
        id: 'voice-settings',
        element: '#voiceSelect',
        title: 'voice_settings_title',
        content: 'voice_settings_guide',
        position: 'left'
      }
    ];
  }

  start() {
    chrome.storage.sync.get('hasCompletedGuide', (result) => {
      if (!result.hasCompletedGuide) {
        this.showStep(0);
        this.addOverlay();
      }
    });
  }

  showStep(index) {
    const step = this.steps[index];
    const tooltip = document.createElement('div');
    tooltip.className = 'speakeasy-guide-tooltip';
    tooltip.innerHTML = `
      <div class="guide-content">
        <h4>${chrome.i18n.getMessage(step.title)}</h4>
        <p>${chrome.i18n.getMessage(step.content)}</p>
        <div class="guide-buttons">
          ${index > 0 ? '<button class="guide-prev">←</button>' : ''}
          <button class="guide-next">${index < this.steps.length - 1 ? '→' : '完成'}</button>
        </div>
        <div class="guide-progress">
          ${index + 1} / ${this.steps.length}
        </div>
      </div>
    `;

    document.body.appendChild(tooltip);
    this.positionTooltip(tooltip, step);
    this.addTooltipListeners(tooltip, index);
  }

  positionTooltip(tooltip, step) {
    if (step.element) {
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
            tooltip.style.right = `${window.innerWidth - rect.left + 10}px`;
            tooltip.style.top = `${rect.top}px`;
            break;
        }
      }
    } else {
      // Center on screen
      tooltip.style.left = '50%';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
    }
  }

  addTooltipListeners(tooltip, index) {
    const nextBtn = tooltip.querySelector('.guide-next');
    const prevBtn = tooltip.querySelector('.guide-prev');

    nextBtn.addEventListener('click', () => {
      tooltip.remove();
      if (index < this.steps.length - 1) {
        this.showStep(index + 1);
      } else {
        this.complete();
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        tooltip.remove();
        this.showStep(index - 1);
      });
    }
  }

  addOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'speakeasy-guide-overlay';
    document.body.appendChild(overlay);
  }

  complete() {
    document.querySelector('.speakeasy-guide-overlay')?.remove();
    chrome.storage.sync.set({ hasCompletedGuide: true });
  }
} 