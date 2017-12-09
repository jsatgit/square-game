import Events from './events.js';

const PLAY_ICON = "play_arrow";
const PAUSE_ICON = "pause";

export default class UI { 
  constructor(game) {
    this.game = game;
    this.playButton = this._getElement("play-button");
    this.pauseButton = this._getElement("pause-button"); 
    this.stepButton = this._getElement("step-button");
    this.stopButton = this._getElement("stop-button");
    this.generationCounter = this._getElement("generation-counter");
    this.initUI();
  }

  initUI() {
    this.playButton.addEventListener("click", () => {
      this.game.start();
    });

    this.pauseButton.addEventListener("click", () => {
      this._pause();
    });

    this.stepButton.addEventListener("click", () => {
      this._pause();
      this.game.tick();
    });

    this.stopButton.addEventListener("click", () => {
      this.game.reset();
      this._setGeneration(this.game.generation);
    });
    
    this.game.addEventListener(Events.NEW_GENERATION, () => {
      this.generationCounter.innerHTML = this.game.generation;
    });
  }

  _getElement(elementId) {
    return document.getElementById(elementId);
  }

  _setGeneration(value) {
    this.generationCounter.innerHTML = value;
  }

  _dispatch(eventName) {
    this.game.eventListeners.dispatch(eventName);
  }

  _pause() {
    if (this.game.isRunning) {
      this.game.pause();
    }
  }
};
