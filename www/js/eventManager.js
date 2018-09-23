class ActionExecuter {

  constructor() {

  }
  //初期化
  init() {

  }
  //毎フレームの実行処理
  execute() {

  }

}

class InitExecuter {
  constructor() {
    this.count = 0;
    this.i = 0;
    this.state = 0;
  }
  //初期化
  init() {
    this.i = 0;
    this.count = 0;
    this.state = 0;
  }
  //毎フレームの実行処理
  execute() {
    let result = false;
    switch (this.state) {
      case 0: //デッキや状態の初期化
        BB.reset();
        PM.init();
        deck = new Deck();
        deck.shuffle();
        this.state++;
        break;
      case 1: //配牌
        this.count++;
        if (this.count >= 5) {
          if (this.i < PLAYER_NUM * 5) {
            this.count = 0;
            PM.current().draw(deck.next);
            PM.step();
            this.i++;
          } else {
            this.state++;
          }
        }
        break;
      case 2: //描画完了待ち
        if (BB.hasMoved()) {
          BB.dora = deck.next;
          BB.dora.dest.position.x = CENTER_X - 0.55 * IMAGE_WIDTH * IMAGE_SCALE;
          BB.dora.texture = BB.dora.front;
          BB.dora.ismove = true;
          PM.sort();
          result = true;
        }
        break;
      default:
        break;
    }
    return result;
  }
}

class FinishExecuter {
  constructor() {
    this.state = 0;
    this.count = 0;
    this.i = 0;
    this.items = [];
    this.ok = false;
  }
  //初期化
  init() {
    this.state = 0;
    this.items = [];
  }
  //毎フレームの実行処理
  execute() {
    let result = false;
    switch (this.state) {
      case 0://終了表示
        this.i = 0;
        this.count = 0;
        //ツモかロンを判断
        this.state = (PM.current().result.score >= 5) ? 1 : 3;
        this.idx = this.seek = PM.idx;
        break;
      case 1://ツモ
        console.log("自摸");
        this.drawBackground();
        this.state++;
        break;
      case 2:
        if (this.ok) {
          result = true;
        }
        break;
      case 3:
        this.drawBackground();
        this.state++;
        break;
      case 4:
        
        break;
      default:
        break;
    }
    return result;
  }
  //ダイアログのOKが押された時のイベント
  ok() { this.ok = true; }

  drawBackground() {
    var bezel = 140;
    var graphics = new PIXI.Graphics();
    // set a fill and a line style again and draw a rectangle
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.beginFill(0xFFCCCC, 1);
    graphics.drawRect(bezel, bezel, CANVAS_WIDTH - 2 * bezel, CANVAS_WIDTH - 2 * bezel);
    graphics.alpha = 0.5;
    BB.stage.addChild(graphics);
    this.items.push(graphics);


    let word = "";

    for (let w of PM.players[this.seek].result.detail) {
      word += w + "\r\n";
    }
    word.trim();
    var label = new PIXI.Text(word, {
      font: "36px/1.2 vt",
      fill: "white",
      stroke: '#4a1850',
      strokeThickness: 5
    });
    label.anchor.x = 0.5;
    label.anchor.y = 0.5;

    label.position.x = CENTER_X;
    label.position.y = CENTER_Y;
    this.items.push(label);
    BB.stage.addChild(label);

    let score = PM.players[this.seek].result.score;
    if (this.seek == PM.idx) {
      console.log("ツモ");
      //ツモの場合均等割で切り上げ
      score = Math.ceil(score / 3);
      console.log("各" + score);
      for (let i in PM.players) {
        if (i == PM.idx) {
          PM.players[i].addScore(3 * score);
        } else {
          PM.players[i].addScore(-1 * score);
        }
      }
    } else {
      //ロンの場合直撮り
      PM.players[this.seek].addScore(score);
      PM.current().addScore(-1 * score);
    }
    var ok = new PIXI.Text("OK", {
      font: "36px/1.2 vt",
      fill: "white",
      stroke: '#4a1850',
      strokeThickness: 5
    });
    ok.anchor.x = 0.5;
    ok.anchor.y = 0.5;
    ok.position.x = CENTER_X;
    ok.position.y = CENTER_Y + 120;
    ok.buttonMode = true;
    ok.interactive = true;
    ok.click = ok.tap = function (data) {
      for (let x of exec.finish.items) {
        BB.stage.removeChild(x)
      }
      exec.finish.seek++;
      exec.finish.state = 1;
    };
    this.items.push(ok);
    BB.stage.addChild(ok);

  }
}
