//実行後に実物が入る場所
var PD = null;

//表示しているPixiObjectとその動きの管理
class PixiDirector {

  constructor() {
    this.stage = new PIXI.Stage(0x000000);
    this.renderer = null;
    this.items = [];
    this.init();
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
  update(deltaTime) {
    for (let i of this.items) {
      i.update(deltaTime);
    }
  }

  hasMoved() {
    return this.items.every(i => i.isMoving === false);
  }
  appear(obj){
    this.items.push(obj);
    this.stage.addChild(obj.view);
  }
  disappear(obj){
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
