// This is a JavaScript file

class FinishDirector {
  constructor() {
    this.state = 0;
    this.count = 0;
    this.i = 0;
    this.ok = false;
    this.dialog = null;
    this.score = {};
  }
  //初期化
  init() {
    this.state = 0;
  }
  //毎フレームの実行処理
  execute() {
    let result = false;
    switch (this.state) {
      case 0://終了表示
        this.i = 0;
        this.count = 0;
        //ツモかロンを判断
        this.state = (PM.current().isDone()) ? 1 : 3;
        this.idx = PM.currentIdx;
        break;
      case 1://ツモ
        PM.current().open();
        let score = Math.ceil(PM.current().result.score / (PLAYER_NUM - 1));
        this.score = {};
        this.ok = false;
        for (let i = 0; i < PLAYER_NUM; i++) {
          let s = (PM.currentIdx == i) ? score * (PLAYER_NUM - 1) : -1 * score;
          this.score["_" + i] = s;
          PM.players[i].addScore(s);
        }
        this.ok = false;
        this.dialog = new PixiScoreResultDialog(PM.current().result.detail, this.score, this);
        this.dialog.show();
        this.state++;
        break;
      case 2:
        if (this.ok) {
          if (PM.currentIdx != 0) {
            PM.current().close();
          }
          result = true;
        }
        break;
      case 3:
        do {
          this.idx++;
          this.idx %= PLAYER_NUM;
          if (PM.players[this.idx].isDone()) {

            PM.players[this.idx].open();
            let score = PM.players[this.idx].result.score;
            this.score = {};
            this.score["_" + this.idx] = score;
            PM.players[this.idx].addScore(score);
            this.score["_" + PM.currentIdx] = -1 * score;
            PM.current().addScore(-1 * score);
            this.ok = false;
            this.dialog = new PixiScoreResultDialog(PM.players[this.idx].result.detail, this.score, this);
            this.dialog.show();
            this.state++;
            break;
          }
        } while (this.idx != PM.currentIdx);
        //引っかからずに抜けてきたら終了
        if (this.idx == PM.currentIdx) {
          result = true;
        }
        break;
      case 4:
        if (this.ok) {
          //自分以外だと手配を閉じる
          if (this.idx != 0) {
            PM.players[this.idx].close();
          }
          this.state--;
        }
        break;
      default:
        break;
    }
    return result;
  }
}
