export default class EventListeners {
  constructor() {
    this.eventListeners = {};
  }

  register(eventName, callback) {
    if (!(eventName in this.eventListeners)) {
      this.eventListeners[eventName] = [];
    }
    this.eventListeners[eventName].push(callback);
  }

  dispatch(eventName, ...args) {
    if (eventName in this.eventListeners) {
      this.eventListeners[eventName].forEach(callback => callback(...args));
    }
  }
}

