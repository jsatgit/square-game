export default class Colour {
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

export const BLUE = new Colour(0, 191, 255, 1);
export const RED = new Colour(255, 64, 0, 1);
export const WHITE = new Colour(255, 255, 255, 1);
