
const PLAY_ICON = "play_arrow";
const PAUSE_ICON = "pause";

class UI {
    constructor(config) {
        this.game = config.game;
        this.playPauseBtn = config.playPauseBtn;
        this.stepBtn = config.stepBtn;
        this.stopBtn = config.stopBtn;
        this.generationCounter = config.generationCounter;
        this.mousePosition = config.mousePosition;
        this.initUI();
    }

    initUI() {
        this.playPauseBtn.onclick = () => this.onPlayPause();
        this.stepBtn.onclick = () =>this.update();
        this.stopBtn.onclick = () => this.onStop();
        this.playPauseIcon = this.playPauseBtn.firstElementChild;
        this.game.stage.on("stagemousemove", (e) => this.updateMousePos(e));
    }

    onPlayPause() {
        let paused = false;
        if (this.game.hasTicker) {
            paused = !createjs.Ticker.getPaused();
            createjs.Ticker.setPaused(paused);
        } else {
            this.game.hasTicker = true;
            createjs.Ticker.interval = this.game.tickSize;
            createjs.Ticker.on("tick", this);
        }
        this.updatePlayPause(paused);
    }

    onStop() {
        createjs.Ticker.paused = true;
        this.updatePlayPause(true);
        this.game.restart();
        this.updateGenerations();
    }
    
     handleEvent() {
        if(!createjs.Ticker.getPaused()) {        
            this.update();
        }
    }
    
    update() {
        this.game.tick();
        this.updateGenerations();
    }
    
    updatePlayPause(paused) {
        
        this.playPauseIcon.innerHTML = paused ?
            PLAY_ICON : PAUSE_ICON;
    }
    
    updateGenerations() {
        this.generationCounter.innerHTML = this.game.generations;
    }

    updateMousePos(e) {
        this.mousePosition.innerHTML = `(\ 
            ${Math.floor(e.stageX/this.game.squareSize)},\
            ${Math.floor(e.stageY/this.game.squareSize)})`;
    }
};
