import Army from './army.js';
import EventListeners from './event-listeners.js';
import View from './view.js';
import Board from './board.js';
import Events from './events.js';

export default class Game {
  constructor(config) {
    this.squareSize = config.squareSize;
    this.width = config.width;
    this.height = config.height;
    this.players = config.players;
    this.tickSize = 40;
    this.generation = 0;
    this.eventListeners = new EventListeners();
    this.isRunning = false;
    this.reset();
  }

  _addArmiesToBoard() {
    this.players.forEach(player => {
      const army = new Army(player.armySize, player);
      this.board.addArmy(player.startingPosition, army);
    });
  }

  _setTargets(cell) {
    const targets = cell.army.player.strategy.getTargets(cell);
    return targets.reduce((armySizeToVacate, target) => 
      armySizeToVacate + cell.dispatchArmy(target), 0);
  }

  _resolveTargets(cell) {
    if (cell.army) {
      cell.targeters.add(cell.army);
    }
    cell.army = cell.targeters.winner;
    cell.targeters.reset();
  }

  _update() {
    const armiesToVacate = [];
    for (let cell of this.board) {
      if (cell.army) {
        const armySizeToVacate = this._setTargets(cell);
        armiesToVacate.push({cell, armySizeToVacate});
      }
    }

    armiesToVacate.forEach(({cell, armySizeToVacate}) => 
      cell.vacateArmy(armySizeToVacate)
    );

    for (let cell of this.board) {
      if (cell.targeters.hasTargeters()) {
        this._resolveTargets(cell);
      }
    }
  }

  _runForever() {
    if (this.isRunning) {
      this.tick();
      setTimeout(this._runForever.bind(this), this.tickSize);
    }
  }

  reset() {
    this.view = new View(this.squareSize);
    this.board = new Board(this.width, this.height);
    this.isRunning = false;
    this.generation = 0;
    this._addArmiesToBoard();
    this.render();
    this.eventListeners.dispatch(Events.NEW_GENERATION, this.generation);
  }

  render() {
    this.view.render(this.board);
  }

  incrementGeneration() {
    this.eventListeners.dispatch(Events.NEW_GENERATION, ++this.generation);
  }

  addEventListener(eventName, callback) {
    this.eventListeners.register(eventName, callback);
  }

  tick() {
    this._update();
    this.render();
    this.incrementGeneration();
  }

  pause() {
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this._runForever();
  }
}
