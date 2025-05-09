class LoadingIndicator {
  constructor() {
    this.element = this.createElement();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'speakeasy-loading';
    div.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text"></div>
    `;
    return div;
  }

  show(text = chrome.i18n.getMessage('loading')) {
    this.element.querySelector('.loading-text').textContent = text;
    document.body.appendChild(this.element);
  }

  hide() {
    if (this.element.parentNode) {
      this.element.remove();
    }
  }

  updateText(text) {
    this.element.querySelector('.loading-text').textContent = text;
  }
} 