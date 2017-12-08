import Army from './army.js';
import Targeters from './targeters.js';

export default class Cell {
  constructor(position) {
    this.position = position;
    this.army = null;
    this.neighbours = [];
    this.targeters = new Targeters();
  }

  vacateArmy(size) {
    this.army.size -= size;
    if (this.army.size <= 0) {
      this.army = null;
    }
  }

  dispatchArmy(target) {
    const availableArmySize = Math.min(target.armySize, this.army.size);
    if (availableArmySize > 0) {
      // TODO copy constructor
      const army = new Army(availableArmySize, this.army.player);
      target.cell.targeters.add(army);
    }
    return availableArmySize;
  }

  get id() {
    return this.position.toString();
  }
}
