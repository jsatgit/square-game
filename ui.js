
const PLAY_ICON = "play_arrow";
const PAUSE_ICON = "pause";

class UI {
  constructor(config) {
    this.game = config.game;
    this.playButton = config.playButton;
    this.stepButton = config.stepButton;
    this.stopButton = config.stopButton;
    this.generationCounter = config.generationCounter;
    this.events = config.events;
    //this.mousePosition = config.mousePosition;
    this.initUI();
  }

  initUI() {
    this.playIcon = this.playButton.firstElementChild;
    this.stopButton.onclick = () => {
      this.game.reset();
    };
    this.playButton.onclick = () => {
      if (this.game.isRunning) {
        this.game.pause();
        this.playIcon.innerHTML = PLAY_ICON;
      } else {
        this.game.start();
        this.playIcon.innerHTML = PAUSE_ICON;
      }
    };
    this.stepButton.onclick = () => {
      this.playIcon.innerHTML = PLAY_ICON;
      this.game.start();
      this.game.pause();
    };
    this.game.addEventListener(this.events.NEW_GENERATION, () => {
      this.generationCounter.innerHTML = this.game.generation;
    });
  }
};
