
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
        PM.init();
        deck.init();
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
        if (PD.hasMoved()) {
          deck.dora = deck.next;
          deck.dora.setDest({ x: CENTER_X - 0.55 * IMAGE_WIDTH * IMAGE_SCALE });
          deck.dora.faceUp();
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

