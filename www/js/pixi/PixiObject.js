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
  setPosition(x, y) {
    this.view.position.set(x, y);
  }
  //表示サイズ設定
  setSize(w, h) {
    this.size.w = w;
    this.size.h = h;
    this.view.width = w;
    this.view.height = h;
  }

  //移動先設定
  setDest(x, y) {
    this.dest.x = x;
    this.dest.y = y;
    this.isMoving = true;
  }

  get distanceX() { return this.dest.x - this.view.position.x; }
  get distanceY() { return this.dest.y - this.view.position.y; }
  //毎フレームのアニメーション
  update(deltaTime) {
    if (this.isMoving) {
      let scaler = this.speed / Math.sqrt(Math.pow(this.distanceX, 2) + Math.pow(this.distanceY, 2)) * deltaTime / 100;
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
    this.view.on("pointerdown", func);
  }
  //ボタン有効設定
  setActive(b) {
    // カーソルを変化させるフラグのため、スマホでは特に不要な項目
    //this.view.buttonMode = b;
    // ボタンの有効化
    this.view.interactive = b;
  }
}