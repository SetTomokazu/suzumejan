// This is a JavaScript file

class PixiObject {
  constructor() {
    this.view = null;//new PIXI.Text("PixiObject", { font: "36px/1.2 vt", fill: "white" });
    this.isMoving = false;
    this.size = { h: 0, w: 0 };
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
    PD.appear(this);
  }
  //表示項目から除外する
  hide() {
    PD.disappear(this);
  }
  //回転設定
  setRotation(rot) {
    this.view.rotation = rot;
  }
  //座標設定
  setPosition(pos) {
    if ('x' in pos) { this.view.position.x = pos.x; }
    if ('y' in pos) { this.view.position.y = pos.y; }
  }
  //表示サイズ設定
  setSize(size) {
    this.size.w = ('w' in size) ? size.w : this.view.width;
    this.size.h = ('h' in size) ? size.h : this.view.height;
    this.view.width = ('w' in size) ? size.w : this.view.width;
    this.view.height = ('h' in size) ? size.h : this.view.height;
  }

  //移動先設定
  setDest(pos) {
    this.dest.x = ('x' in pos) ? pos.x : this.view.position.x;
    this.dest.y = ('y' in pos) ? pos.y : this.view.position.y;
    this.isMoving = true;
  }

  get distanceX() { return this.dest.x - this.view.position.x; }
  get distanceY() { return this.dest.y - this.view.position.y; }
  //毎フレームのアニメーション
  update(deltaTime) {
    if (this.isMoving) {
      this.setSize(this.size);
      let scaler = this.speed / Math.sqrt(Math.pow(this.distanceX, 2) + Math.pow(this.distanceY, 2)) * deltaTime / 10;
      if (scaler > 1) {
        this.setPosition(this.dest);
        this.isMoving = false;
        this.setSize(this.size);
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