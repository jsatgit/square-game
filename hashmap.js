export default class HashMap {
  constructor() {
    this.map = {};
  }

  has(key) {
    return key in this.map;
  }

  get(key) {
    return this.map[key];
  }

  set(key, value) {
    this.map[key] = value;
  }
}
