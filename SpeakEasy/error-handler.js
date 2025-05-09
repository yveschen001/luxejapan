class ErrorHandler {
  constructor() {
    this.errorTypes = {
      NETWORK: 'network_error',
      PERMISSION: 'permission_error',
      SYNTHESIS: 'synthesis_error',
      API: 'api_error',
      UNKNOWN: 'unknown_error'
    };
  }

  handleError(error) {
    const errorType = this.categorizeError(error);
    this.logError(error);
    this.showUserFriendlyError(errorType);
    this.suggestSolution(errorType);
  }

  showUserFriendlyError(error) {
    const errorMessages = {
      network_error: chrome.i18n.getMessage("error_network"),
      permission_error: chrome.i18n.getMessage("error_permission"),
      synthesis_error: chrome.i18n.getMessage("error_synthesis"),
      api_error: chrome.i18n.getMessage("error_api"),
      unknown_error: chrome.i18n.getMessage("error_unknown")
    };
    
    return errorMessages[error] || errorMessages.unknown_error;
  }
} 