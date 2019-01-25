//表示しているPixiObjectとその動きの管理
class PixiDirector {

  constructor() {
    this.stage = new PIXI.Stage(0x000000);
    this.renderer = null;
    this.items = [];
    this.init();
    this.isMoving = false;
    this.lastTime = 0;
  }
  init() {
    this.screenSize = setBound();
    this.renderer = (getUa() === "Android") ?
      new PIXI.CanvasRenderer(this.screenSize.width, this.screenSize.height) :
      new PIXI.autoDetectRenderer(this.screenSize.width, this.screenSize.height);
    this.renderer.transparent = false;
    document.getElementById('stage').appendChild(this.renderer.view);
    //document.body.appendChild(this.renderer.view);
    setScale(this.screenSize);
  }
  getDeltaTime(time) {
    let deltaTime = time - this.lastTime;
    this.lastTime = time;
    return deltaTime;
  }
  update(time) {
    let deltaTime = this.getDeltaTime(time);
    for (let i of this.items) {
      i.update(deltaTime);
    }
  }
  draw() {
    this.renderer.render(this.stage);   // 描画する
  }

  get hasMoved() {
    return this.items.every(i => i.isMoving === false);
    let result = false;
    let current = this.items.every(i => i.isMoving === false);
    if (this.isMoving === true && current === false) {
      result = true;
      this.isMoving = false;
    } else if (current === true) {
      this.isMoving = true;
    } else {
      /* 現状維持のため何もしない */
    }
    return result;
  }

  appear(obj) {
    this.items.push(obj);
    this.stage.addChild(obj.view);
  }
  disappear(obj) {
    this.items = this.items.filter(n => n !== obj);
    this.stage.removeChild(obj.view);
  }
  reset() {
    for (var i = this.stage.children.length - 1; i >= 0; i--) {
      this.stage.removeChildAt(i);
    }
    this.items = [];
  }
}
