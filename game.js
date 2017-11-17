const blue = "#00bfff";
const red = "#ff4000";

const board = [];

const EMPTY = 0;
const RED = 1;
const BLUE = 2;

const squares = {
  [BLUE]: [{x:0, y:0}],
  [RED]: [{x:99, y:99}]
}

const WIDTH = 100;
const HEIGHT = 100;

const SQUARE_SIZE = 5;

function runEvery(func, ms) {
  func();
  setTimeout(() => runEvery(func, ms), ms);
}

function main() {
  const stage = new createjs.Stage("canvas");
  initBoard();
  runEvery(() => tick(stage), 40);
}

function initBoard() {
  let i, j;
  for (i = 0; i < HEIGHT; ++i) {
    board.push([]);
    for (j = 0; j < WIDTH; ++j) {
      board[i].push(EMPTY);
    }
  }
}

function boardGet(pos) {
  return board[pos.y][pos.x];
}

function boardSet(pos, side) {
  board[pos.y][pos.x] = side;
}

function withinBounds(pos) {
  return pos.x >= 0 && pos.x < WIDTH && pos.y >= 0 && pos.y < HEIGHT;
}

function isUnoccupied(pos) {
  return boardGet(pos) === EMPTY;
}

function posToCoord(pos) {
  return {
    x: pos.x * SQUARE_SIZE,
    y: pos.y * SQUARE_SIZE,
  }  
}

function shouldExpand(newSquare) {
  return Math.random() < 0.5;
}

function updateSquares(side) {
  const newSquares = [];
  squares[side].forEach(square => {
    let hasFreeNeighbours = false;
    let i,j;
    for (i = -1; i < 2; ++i) {
      for (j = -1; j < 2; ++j) {
        const newSquare = {
          x: square.x + i,
          y: square.y + j
        };
        if (!(i === 0 && j === 0) && withinBounds(newSquare) && isUnoccupied(newSquare)) {
          if (shouldExpand(newSquare)) {
            newSquares.push(newSquare);
            boardSet(newSquare, side);
          }
          hasFreeNeighbours = true;
        }
      }
    }
    if (hasFreeNeighbours) {
      newSquares.push(square);
    }
  });
  squares[side] = newSquares;
}

function renderSquares(stage, side, color) {
  squares[side].forEach(square => {
    const cord = posToCoord(square);
    drawRect(stage, cord.x, cord.y, color);
  });
}

function tick(stage) {
  updateSquares(BLUE);
  updateSquares(RED);
  renderSquares(stage, BLUE, blue);
  renderSquares(stage, RED, red);
  stage.update();
}

function drawRect(stage, x, y, color) {
  const square = new createjs.Shape();
  square.graphics.beginFill(color).drawRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
  stage.addChild(square);
}
