Array.prototype.randomElement = function() {
  if (this.length === 0) {
    return null;
  }

  const i = Math.floor(Math.random() * this.length);
  return this[i];
};

class Colour {
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toString() {
    return `rgba(${this.r},${this.g},${this.b},${this.a.toFixed(1)})`;
  }
}

const BLUE_COLOUR = new Colour(0, 191, 255, 1);
const RED_COLOUR = new Colour(255, 64, 0, 1);
const WHITE_COLOUR = new Colour(255, 255, 255, 1);

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Strategy {
  getTargets(cell) {
    const randomNeighbour = cell.neighbours.randomElement();
    const armySize = Math.floor(cell.army.size / 2);
    return [ new Target(randomNeighbour, armySize) ];
  }
}

class Player {
  constructor(config) {
    this.colour = config.colour;
    this.startingPosition = config.startingPosition;
    this.armySize = 1000;
    this.strategy = new Strategy();
  }
}

class Army {
  constructor(size=0, player) {
    this.size = size;
    this.player = player;
  }
}

class Target {
  constructor(cell, armySize) {
    this.cell = cell;
    this.armySize = armySize;
  }
}

class Targeters {
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

class Cell {
  constructor(position) {
    this.position = position;
    this.army = null;
    this.neighbours = [];
    this.targeters = new Targeters();
  }

  _vacateArmy(size) {
    this.army.size -= size;
    if (this.army.size <= 0) {
      this.army = null;
    }
  }

  dispatchArmy(target) {
    const availableArmySize = Math.min(target.armySize, this.army.size);
    if (availableArmySize > 0) {
      this._vacateArmy(availableArmySize);
      // TODO copy constructor
      const army = new Army(availableArmySize, this.army.player);
      target.cell.targeters.add(army);
    }
  }
}

class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this._initCells();
    this._addNeighboursToCells();
  }

  _initCells() {
    this.cells = new Array(this.height);
    for (let i = 0; i < this.cells.length; ++i) {
      this.cells[i] = new Array(this.width);
      for (let j = 0; j < this.cells[i].length; ++j) {
        const position = new Position(j, i);
        this.cells[i][j] = new Cell(position);
      }
    }
  }

  _addNeighboursToCells() {
    for (let cell of this) {
      for (
        let i = Math.max(0, cell.position.y - 1);
        i < Math.min(this.height, cell.position.y + 2);
        ++i
      ) {
        for (
          let j = Math.max(0, cell.position.x - 1);
          j < Math.min(this.width, cell.position.x + 2);
          ++j
        ) {
          if (!(i === cell.position.y && j === cell.position.x)) {
            cell.neighbours.push(this.cells[i][j]);
          }
        }
      }
    }
  }
  
  *[Symbol.iterator]() {
    for (let i = 0; i < this.cells.length; ++i) {
      for (let j = 0; j < this.cells[i].length; ++j) {
        yield this.cells[i][j];
      }
    }
  }

  addArmy(position, army) {
    this.cells[position.y][position.x].army = army;
  }
}

class View {
  constructor(squareSize) {
    this.stage = new createjs.Stage('canvas');
    this.previousRender = new Map();
    this.squareSize = squareSize;
  }

  _drawRect(x, y, color) {
    const square = new createjs.Shape();
    square.graphics
      .beginFill(color)
      .drawRect(x, y, this.squareSize, this.squareSize);
    this.stage.addChild(square);
  }

  _modelToViewCoord(position) {
    return {
      x: position.x * this.squareSize,
      y: position.y * this.squareSize,
    };
  }

  _adjustIntensity(colour, intensity) {
    const a = Math.min(100, intensity / 100);
    return new Colour(colour.r, colour.g, colour.b, a);
  }

  _getColour(cell) {
    const colour = cell.army ? 
      this._adjustIntensity(cell.army.player.colour, cell.army.size) : 
      WHITE_COLOUR;
    return colour.toString();
  }

  _hasCellChanged(cell, newColour) {
    return !this.previousRender.has(cell) || this.previousRender.get(cell) !== newColour;
  }
  
  render(board) {
    for (let cell of board) {
      const colour = this._getColour(cell);
      if (this._hasCellChanged(cell, colour)) {
        this.previousRender.set(cell, colour);
        const {x, y} = this._modelToViewCoord(cell.position);
        this._drawRect(x, y, colour);
      } 
    }
    this.stage.update();
  }
}

class Game {
  constructor(config) {
    this.squareSize = config.squareSize;
    this.width = config.width;
    this.height = config.height;
    this.players = config.players;
    this.tickSize = 40;
  
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
    targets.forEach(target => {
      cell.dispatchArmy(target);
    });
  }

  _resolveTargets(cell) {
    if (cell.army) {
      cell.targeters.add(cell.army);
    }
    cell.army = cell.targeters.winner;
    cell.targeters.reset();
  }

  _update() {
    for (let cell of this.board) {
      if (cell.army) {
        this._setTargets(cell);
      }
    }

    for (let cell of this.board) {
      if (cell.targeters.hasTargeters()) {
        this._resolveTargets(cell);
      }
    }
  }

  reset() {
    this.view = new View(this.squareSize);
    this.board = new Board(this.width, this.height);

    this._addArmiesToBoard();
  }

  render() {
    this.view.render(this.board);
  }

  tick() {
    this._update();
    this.render();
  }

  start() {
    this.render();
    runEvery(() => this.tick(), this.tickSize);
  }
}

function runEvery(func, ms) {
  func();
  setTimeout(() => runEvery(func, ms), ms);
}

function main() {
  const player1 = new Player({
    colour: BLUE_COLOUR,
    startingPosition: new Position(0, 0),
  });

  const player2 = new Player({
    colour: RED_COLOUR,
    startingPosition: new Position(24, 24),
  });

  const game = new Game({
    width: 25,
    height: 25,
    squareSize: 20,
    players: [player1, player2],
  });

  game.start();
}
