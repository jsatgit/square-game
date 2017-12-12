import Player from './player.js';
import Game from './game.js';
import {BLUE, RED} from './colour.js';
import Position from './position.js';
import UI from './ui.js';

const ARMY_SIZE = 1000;

const player1 = new Player({
  colour: BLUE,
  startingPosition: new Position(0, 0),
  startingArmySize: ARMY_SIZE,
});

const player2 = new Player({
  colour: RED,
  startingPosition: new Position(24, 24),
  startingArmySize: ARMY_SIZE,
});

const game = new Game({
  width: 25,
  height: 25,
  squareSize: 20,
  players: [player1, player2],
});

const ui = new UI(game);
