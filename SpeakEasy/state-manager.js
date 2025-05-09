class StateManager {
  constructor() {
    this.states = {
      loading: false,
      playing: false,
      error: null
    };
    
    this.listeners = new Map();
  }

  setState(key, value) {
    this.states[key] = value;
    this.notifyListeners(key);
  }

  getState(key) {
    return this.states[key];
  }

  addListener(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
  }

  removeListener(key, callback) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).delete(callback);
    }
  }

  notifyListeners(key) {
    if (this.listeners.has(key)) {
      const value = this.states[key];
      this.listeners.get(key).forEach(callback => callback(value));
    }
  }

  showLoading() {
    this.setState('loading', true);
  }

  hideLoading() {
    this.setState('loading', false);
  }

  setError(error) {
    this.setState('error', error);
    setTimeout(() => {
      this.setState('error', null);
    }, 3000);
  }
} 