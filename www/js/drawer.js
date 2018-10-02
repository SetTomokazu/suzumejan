class DrawManager {

  constructor() {
    this.stage = new PIXI.Stage(0x000000);
    this.renderer = null;
    this.blocks = [];
    this.time = null;
    this.isMouseDown = false;
    this.dora = null;
    this.OK = null;
    this.Cancel = null;
  }

  // Reset current game and start new one
  reset() {
    //Reset (remove all children in the stage if exists)
    for (var i = BB.stage.children.length - 1; i >= 0; i--) {
      BB.stage.removeChildAt(i);
    }
    BB.blocks = [];
  }

  // Game Over
  endGame() {
    BB.gameState = GAMESTATE_STOP;
    vibrate();
  }

  // Game Clear
  clearGame() {
    if (typeof navigator.notification !== 'undefined') navigator.notification.alert("Cleared!", function () { }, "Congraturations");
    else alert("Cleared!");

    BB.gameState = GAMESTATE_STOP;
  }
}
