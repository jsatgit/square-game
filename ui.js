import Events from './events.js';

const PLAY_ICON = "play_arrow";
const PAUSE_ICON = "pause";

export default class UI { 
  constructor(game) {
    this.game = game;
    this.playButton = getElement("play-button");
    this.pauseButton = getElement("pause-button"); 
    this.stepButton = getElement("step-button");
    this.stopButton = getElement("stop-button");
    this.generationCounter = getElement("generation-counter");
    this._addEventListeners();
    this._reset();
  }

  _addEventListeners() {
    this.playButton.addEventListener("click", this.game.start.bind(this.game));
    this.pauseButton.addEventListener("click", this._pause.bind(this));
    this.stepButton.addEventListener("click", () => {
      this._pause();
      this.game.tick();
    });
    this.stopButton.addEventListener("click", () => {
      this.game.reset();
      this._reset();
    });
    this.game.addEventListener(Events.NEW_GENERATION, () => {
      this._setGeneration(this.game.generation);
    });
  }

  _reset() {
    this._setGeneration(this.game.generation);
  }

  _setGeneration(value) {
    this.generationCounter.innerHTML = value;
  }

  _pause() {
    if (this.game.isRunning) {
      this.game.pause();
    }
  }
};

function getElement(elementId) {
  return document.getElementById(elementId);
}
