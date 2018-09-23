// This is a JavaScript file

class PixiObject {
  constructor() {
    this.view = null;//new PIXI.Text("PixiObject", { font: "36px/1.2 vt", fill: "white" });
    this.isMoving = false;
    this.dest = { x: 0, y: 0 };
    this.speed = CARD_SPEED;
  }
  //座標の起点を表示物の中心に設定する
  //this.viewが継承されたら変わるため、コンストラクタとは別定義
  setCenter() {
    this.view.anchor.x = 0.5;
    this.view.anchor.y = 0.5;
  }
  //表示項目に追加する
  show() {
    BB.stage.addChild(this.view);
  }
  //表示項目から除外する
  hide() {
    BB.stage.removeChild(this.view);
  }
  //回転設定
  setRotation(rot) {
    this.view.rotation = rot;
  }
  //座標設定
  setPosition(pos) {
    this.view.position.x = pos.x;
    this.view.position.y = pos.y;
  }
  //表示サイズ設定
  setSize(h, w) {
    this.view.width = w;
    this.view.height = h;
  }

  //移動先設定
  setDest(pos) {
    this.dest.x = pos.x;
    this.dest.y = pos.y;
    this.isMoving = true;
  }

  static get distanceX() { return this.dest.x - this.view.position.x; }
  static get distanceY() { return this.dest.y - this.view.position.y; }
  //毎フレームのアニメーション
  update(deltaTime) {
    if (this.isMoving) {
      let scaler = this.speed / Math.sqrt(Math.pow(this.distanceX, 2) + Math.pow(this.distanceY, 2)) * deltaTime / 10;
      if (scaler > 1) {
        this.setPosition(this.dest.x, this.dest.y);
        this.isMoving = false;
      } else {
        this.view.position.x += this.distanceX * scaler;
        this.view.position.y += this.distanceY * scaler;
      }
    }
  }
  //タップ時の関数登録
  setFunc(func) {
    this.view.click = this.view.tap = func;
  }
  //ボタン有効設定
  setActive(b) {
    this.setButtonEnable(b);
    this.view.interactive = b;
  }
  //ボタンとして使うかどうかの設定
  setButtonEnable(b) {
    this.view.buttonMode = b;
  }
}