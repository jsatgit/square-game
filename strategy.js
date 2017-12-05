import Target from './target.js';

Array.prototype.randomElement = function() {
  if (this.length === 0) {
    return null;
  }

  const i = Math.floor(Math.random() * this.length);
  return this[i];
};

export default class Strategy {
  getTargets(cell) {
    const randomNeighbour = cell.neighbours.randomElement();
    const armySize = Math.floor(cell.army.size / 2);
    return [ new Target(randomNeighbour, armySize) ];
  }
}
