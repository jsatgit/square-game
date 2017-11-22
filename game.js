const BLUE_COLOUR = "#00bfff";
const RED_COLOUR = "#ff4000";
const WHITE_COLOUR = "#ffffff";

function maxPlayer(dict) {
  let max = {value: 0, player: null};
  for (key in dict) {
    const item = dict[key];
    max = item.value > max.value ? item : max;
  }
  return max.player;
}

function runEvery(func, ms) {
  func();
  setTimeout(() => runEvery(func, ms), ms);
}

function serializePosition(position) {
  return `${position.x}.${position.y}`;
}

class Game {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.squareSize = config.squareSize;
    this.players = config.players;
    this.tickSize = 40
    this.stage = new createjs.Stage("canvas");
    this.board = null;
    this.initBoard();
    this.initPlayers();
  }

  initPlayers() {
    this.players.forEach(player => {
      player.game = this;
    });
  }

  initBoard() {
    this.board = []
    let i, j;
    for (i = 0; i < this.height; ++i) {
      this.board.push([]);
      for (j = 0; j < this.width; ++j) {
        this.board[i].push(null);
      }
    }
  }

  drawRect(x, y, color) {
    const square = new createjs.Shape();
    square.graphics
      .beginFill(color)
      .drawRect(x, y, this.squareSize, this.squareSize);
    this.stage.addChild(square);
  }

  combineAttacks(attacks) {
    const combinedAttacks = {};
    attacks.forEach(playerAttacks => {
      const player = playerAttacks.player;
      playerAttacks.attacks.forEach(attack => {
        const key = serializePosition(attack);
        if (!(key in combinedAttacks)) {
          combinedAttacks[key] = {
            position: attack,
            attacks: {}
          } 
        }
        const declarations = combinedAttacks[key].attacks;
        if (!declarations[player.id]) {
          declarations[player.id] = {
            player,
            value: 0
          };
        }
        declarations[player.id].value += 1;
      });
    });

    for (let key in combinedAttacks) {
      const square = combinedAttacks[key];
      const player = maxPlayer(square.attacks);
      square.winner = player;
    }

    return combinedAttacks;
  }

  render(combinedAttacks) {
    Object.values(combinedAttacks).forEach(square => {
      const cord = this.posToCoord(square.position);
      this.drawRect(cord.x, cord.y, square.winner.colour);
    });
    this.stage.update();
  }

  posToCoord(pos) {
    return {
      x: pos.x * this.squareSize,
      y: pos.y * this.squareSize,
    }  
  }

  tick() {
    const attacks = this.players.map(player => ({
      player,
      attacks: player.getAttacks()
    }));
    const combinedAttacks = this.combineAttacks(attacks);
    this.updateBoard(combinedAttacks);
    this.render(combinedAttacks);
  }

  updateBoard(combinedAttacks) {
    for (let key in combinedAttacks) {
      const square = combinedAttacks[key];
      const posKey = serializePosition(square.position);
      const previousPlayer = this.getPlayer(square.position);
      if (previousPlayer === square.winner) {
        delete combinedAttacks[key];
      } else {
        if (previousPlayer) {
          delete previousPlayer.positions[posKey];
        }
        this.setPlayer(square.position, square.winner);
        square.winner.positions[posKey] = square.position;
      }
    }
  }

  withinBounds(pos) {
    return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
  }

  getPlayer(pos) {
    return this.board[pos.y][pos.x];
  }

  setPlayer(pos, player) {
    this.board[pos.y][pos.x] = player;
  }

  isFree(pos, player) {
    return this.getPlayer(pos) !== player;
  }

  getFreeNeighbours(pos, player) {
    const freeNeighbours = []
    let i,j;
    for (i = -1; i < 2; ++i) {
      for (j = -1; j < 2; ++j) {
        const neighbour = {
          x: pos.x + i,
          y: pos.y + j
        };
        if (this.withinBounds(neighbour)) {
          freeNeighbours.push(neighbour);
        }
      }
    }
    return freeNeighbours;
  }

  start() {
    runEvery(() => this.tick(), this.tickSize);
  }
}

function selectRandom(array) {
  if (array.length === 0) {
    return null;
  }

  const i = Math.floor(Math.random() * array.length);
  return array[i];
}

let id = 0;

function generateId() {
  const tmp = id;
  id += 1;
  return tmp;
}

class Player {
  constructor(config) {
    this.colour = config.colour;
    this.positions = {};
    this.game = null;
    this.id = generateId();

    this.initPositions(config.startingPosition);
  }

  initPositions(startingPosition) {
    const key = serializePosition(startingPosition);
    this.positions[key] = startingPosition;
  }

  getAttacks() {
    const attacks = [];
    Object.values(this.positions).forEach(position => {
      const freeNeighbours = this.game.getFreeNeighbours(position, this);
      const randomNeighbour = selectRandom(freeNeighbours);
      if (randomNeighbour !== null) {
        attacks.push(randomNeighbour);
      }
    });
    return attacks;
  }
}

function main() {
  const player1 = new Player({
    colour: BLUE_COLOUR,
    startingPosition: {x:0, y:0},
  })

  const player2 = new Player({
    colour: RED_COLOUR,
    startingPosition: {x:99, y:99},
  })

  const game = new Game({
    width: 100,
    height: 100,
    squareSize: 5,
    players: [player1, player2],
  });

  game.start();
}

