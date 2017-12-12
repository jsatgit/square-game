import Events from './events.js';
import HashMap from './hashmap.js';
import CounterOutput from './counterOutput.js';

const PLAY_ICON = createIcon("play_arrow");
const PAUSE_ICON = createIcon("pause");
const STOP_ICON = createIcon("stop");
const STEP_ICON = createIcon("forward");

export default class UI { 
  constructor(game) {
    this.game = game;
    this.body = document.getElementsByTagName("body")[0];
    this._render();
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
      this._setPopulation();
      this._setCellStats();
    });
  }

  _reset() {
    this._setGeneration(this.game.generation);
    this._setPopulation();
    this._setCellStats();
  }

  _setGeneration(generation) {
    this.generationCounterOutput.setCount(generation);
  }

  _setPopulation() {
    this.playerPopCounterOutput.forEach((popCounter, index) => {
      popCounter.setCount(this.game.players[index].armySize);
    });
  }

  _setCellStats() {
    for (let i = 0; i < this.cellStats.length; ++i) {
      for (let j = 0; j < this.cellStats[i].length; ++j) {
        const army = this.game.board.cells[i][j].army;
        if (army) {
          const colourBox = createColourBox(army.player.colour.toString());
          this.cellStats[i][j].setLabel(colourBox);
          this.cellStats[i][j].setCount(army.size);
          continue;
        }

        const colourBox = createColourBox();
        this.cellStats[i][j].setLabel(colourBox);
        this.cellStats[i][j].setCount(0);
      }
    }
  }

  _pause() {
    if (this.game.isRunning) {
      this.game.pause();
    }
  }

  _render() {
    this._renderTitle();
    const gameControls = this._createGameControls();
    const stats = this._createStats();
    const cellStats = this.createCellStats();
    this.body.append(gameControls);
    this.body.append(stats);
    this.body.append(cellStats);
  }
  
  _renderTitle() {
    const title = document.createElement("div");
    title.innerHTML = "Square Game";
    title.className = "title";
    this.body.prepend(title); 
  }

  _createGameControls() {
    const gameControls = document.createElement("div");
    this.playButton = createButton(PLAY_ICON);
    this.stopButton = createButton(STOP_ICON);
    this.stepButton = createButton(STEP_ICON);
    this.pauseButton = createButton(PAUSE_ICON);
    gameControls.append(this.stopButton);
    gameControls.append(this.pauseButton);
    gameControls.append(this.playButton);
    gameControls.append(this.stepButton);
    return gameControls;
  }

  _createStats() {
    const stats = document.createElement("div");
    this.generationCounterOutput = new CounterOutput("Generation");
    this.playerPopCounterOutput = new Array(this.game.players.length);
    this.game.players.forEach((player, index) => {
      const colourBox = createColourBox(player.colour.toString());
      this.playerPopCounterOutput[index] = new CounterOutput(colourBox);
    });
    
    stats.append(this.generationCounterOutput.node);
    this.playerPopCounterOutput.forEach(popCounter => {
      stats.append(popCounter.node);
    });
    return stats;
  }

  createCellStats() {
    const container = document.createElement("div");
    this.cellStats = new Array(this.game.width); 
    const stats = new Array(this.game.width);
    for (let i = 0; i < this.cellStats.length; ++i) {
      this.cellStats[i] = new Array(this.game.height);
      stats[i] = document.createElement("div");
      stats[i].className = "counter-output-container";
      for (let j = 0; j < this.cellStats[i].length; ++j) {
        const colourBox = createColourBox();
        this.cellStats[i][j] = new CounterOutput(colourBox, 4);
        stats[i].append(this.cellStats[i][j].node);
      }
      container.append(stats[i]);
    }
    return container;
  }
};

function createIcon(name) {
  const icon = document.createElement("i");
  icon.className = "material-icons";
  icon.innerHTML = name;
  return icon;
}

function createButton(child) {
  const button = document.createElement("button");
  button.append(child);
  return button;
}

function createColourBox(colour="#FFFFFF") {
  const colourBox = document.createElement("div");
  colourBox.className = "colour-box";
  colourBox.style.backgroundColor = colour;
  return colourBox;
}

function getElement(elementId) {
  return document.getElementById(elementId);
}
