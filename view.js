import HashMap from './hashmap.js';
import Colour, {WHITE} from './colour.js';

export default class View {
  constructor(squareSize) {
    this.stage = new createjs.Stage('canvas');
    this.previousRender = new HashMap();
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
    const a = Math.min(1, intensity / 100);
    return new Colour(colour.r, colour.g, colour.b, a);
  }

  _getColour(cell) {
    const colour = cell.army ?
      this._adjustIntensity(cell.army.player.colour, cell.army.size) :
      WHITE;
    return colour.toString();
  }

  _hasCellChanged(cell, newColour) {
    return !this.previousRender.has(cell.id) || this.previousRender.get(cell.id) !== newColour;
  }

  render(board) {
    for (let cell of board) {
      const colour = this._getColour(cell);
      if (this._hasCellChanged(cell, colour)) {
        this.previousRender.set(cell.id, colour);
        const {x, y} = this._modelToViewCoord(cell.position);
        this._drawRect(x, y, colour);
      }
    }
    this.stage.update();
  }
}
