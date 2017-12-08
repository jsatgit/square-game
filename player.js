import Strategy from './strategy.js';

export default class Player {
  constructor(config) {
    this.colour = config.colour;
    this.startingPosition = config.startingPosition;
    this.armySize = 1000000;
    this.strategy = new Strategy();
  }
}
