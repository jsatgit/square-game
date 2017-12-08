import Army from './army.js';

export default class Targeters {
  constructor() {
    this.reset();
  }

  reset() {
    this.targeters = new Map();
    this.winner = new Army();
  }

  hasTargeters() {
    return this.targeters.size > 0;
  }

  add(targeter) {
    if (!this.targeters.has(targeter.player)) {
      const army = new Army(0, targeter.player);
      this.targeters.set(targeter.player, army);
    }

    const existingTargeter = this.targeters.get(targeter.player);
    existingTargeter.size += targeter.size;

    if (existingTargeter.size > this.winner.size) {
      this.winner = existingTargeter;
    }
  }
}
