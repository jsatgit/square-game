
const PLAY_ICON = "play_arrow";
const PAUSE_ICON = "pause";

function onPlayPause() {
    
    var paused = false;

    if (this.game.hasTicker) { 
        paused = !createjs.Ticker.getPaused();
        createjs.Ticker.setPaused(paused);
    } else {
         
        this.game.hasTicker = true;
        createjs.Ticker.interval = this.game.tickSize;
        createjs.Ticker.on("tick", handleEvent, this);
    }
    
    updatePlayPauseIcon(paused);
 

}

function onStop() {
    
    createjs.Ticker.paused = true;
    updatePlayPauseIcon(true);
    this.game.restart();
    updateGenerations();
}

function onStep() {

    update();

}

function handleEvent() {

    if(!createjs.Ticker.getPaused()) {        
        update();
    }
}

function update() {
    
    this.game.tick();
    updateGenerations();

}

function updatePlayPauseIcon(paused) {

    document.getElementById("playpause").innerHTML = paused ?
        PLAY_ICON : PAUSE_ICON;
  
}


function updateGenerations() {
    
    var generations = document.getElementById("gen-value");
    generations.innerHTML = this.game.generations;

}
