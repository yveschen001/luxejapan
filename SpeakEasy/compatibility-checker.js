class CompatibilityChecker {
  constructor() {
    this.requirements = {
      speechSynthesis: 'SpeechSynthesis API',
      storage: 'Chrome Storage API',
      permissions: ['activeTab', 'storage']
    };
  }

  async checkCompatibility() {
    const results = {
      browser: this.checkBrowser(),
      apis: this.checkAPIs(),
      permissions: await this.checkPermissions(),
      language: this.checkLanguageSupport()
    };

    return {
      isCompatible: Object.values(results).every(r => r.supported),
      details: results
    };
  }

  showCompatibilityWarning(results) {
    if (!results.isCompatible) {
      // 显示兼容性警告
    }
  }
} 