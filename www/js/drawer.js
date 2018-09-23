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
  init() {
    this.screenSize = setBound();

    this.renderer = (getUa() === "Android") ?
      new PIXI.CanvasRenderer(this.screenSize.width, this.screenSize.height) :
      new PIXI.autoDetectRenderer(this.screenSize.width, this.screenSize.height);
    this.renderer.transparent = false;
    document.body.appendChild(this.renderer.view);

    setScale(this.screenSize);

  }

  /**
   * @param {int} x
   * @param {int} y
   * @param {String} color red,blue,silver,gold
   * @return {Object} block
   **/
  addBlock(x, y, rot, card, isfront) {
    if (isfront) {
      var texture = PIXI.Texture.fromImage(card.img, true);
    } else {
      console.log("load back");
      var texture = PIXI.Texture.fromImage("img/back.png", true);
    }
    var block = new PIXI.Sprite(texture);
    block.buttonMode = true;
    block.interactive = true;
    block.front = PIXI.Texture.fromImage(card.img, true);
    block.anchor.x = 0.5;
    block.anchor.y = 0.5;
    block.data = Number(card.data);
    block.dora = Number(card.dora);

    block.position.x = x;
    block.position.y = y;
    block.rotation = rot;
    block.width = IMAGE_WIDTH * IMAGE_SCALE;
    block.height = IMAGE_HEIGHT * IMAGE_SCALE;
    block.player = null;
    block.hands_index = null;
    block.click = block.tap = function (data) {
      if (this.interactive) {
        this.player.select(this.hands_index);
      }
    };

    block.dest = {};
    block.dest.position = {};
    block.dest.position.x = x;
    block.dest.position.y = y;
    block.speed = CARD_SPEED;
    block.ismove = false;

    BB.stage.addChild(block);
    BB.blocks.push(block);

    return block;
  }
  move(deltaTime) {
    for (let b of BB.blocks) {
      if (b.ismove) {
        var scaler = b.speed / Math.sqrt(Math.pow(b.dest.position.x - b.position.x, 2) + Math.pow(b.dest.position.y - b.position.y, 2)) * Math.min(deltaTime, 17) / 10;
        if (scaler > 1) {
          b.position = b.dest.position;
          b.ismove = false;
        } else {
          b.position.x += (b.dest.position.x - b.position.x) * scaler;
          b.position.y += (b.dest.position.y - b.position.y) * scaler;
        }
      }
    }
  }
  /**
   * Add points to current score
   * @param {int} val points to add
   */
  addScore(val) {
    BB.score += parseInt(val);
    BB.scoreLabel.setText(BB.score);
  }
  hasMoved() {
    return this.blocks.every(b => b.ismove == false);
  }

  showFinishDialogButton(player, word) {
    var ok = new PIXI.Text(word, { font: "36px/1.2 vt", fill: "white" });
    ok.position.x = 18;
    ok.position.y = CENTER_X * 1.5;
    this.OK = ok;
    this.stage.addChild(ok);
    ok.buttonMode = true;
    ok.interactive = true;
    ok.click = ok.tap = function (data) {
      BB.deleteDialogButton();
      vote++;
    };
    var cancel = new PIXI.Text("キャンセル", { font: "36px/1.2 vt", fill: "white" });
    cancel.position.x = 18;
    cancel.position.y = CENTER_X * 1.7;
    this.Cancel = cancel;
    this.stage.addChild(cancel);
    cancel.buttonMode = true;
    cancel.interactive = true;
    cancel.click = cancel.tap = function (data) {
      PM.user.pass();
      BB.deleteDialogButton();
      vote++;
    };
  }
  deleteDialogButton() {
    if (BB.OK != null) {
      BB.stage.removeChild(BB.OK);
      BB.OK = null;
    }
    if (BB.Cancel != null) {
      BB.stage.removeChild(BB.Cancel);
      BB.Cancel = null;
    }
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
