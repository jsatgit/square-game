import Strategy from './strategy.js';

export default class Player {
  constructor(config) {
    this.colour = config.colour;
    this.startingPosition = config.startingPosition;
    this.startingArmySize = config.startingArmySize;
    this.strategy = new Strategy();
    this.reset();
  }

  kill(size) {
    this.armySize -= size;
  }

  reset() {
    this.armySize = this.startingArmySize;
  }
}
