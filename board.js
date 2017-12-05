import Position from './position.js';
import Cell from './cell.js';

export default class Board {
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

