//表示しているPixiObjectとその動きの管理
class PixiDirector {

  constructor() {

    this.renderer = new PIXI.autoDetectRenderer(
      //360,640,
      window.innerWidth,
      window.innerHeight,
      {
        antialias: true,
        transparent: true,
        backgroundColor: 0x3f3f3f
      }
    );
    document.getElementById('stage').appendChild(this.renderer.view);
    this.stage = new PIXI.Container();
    this.stage.scale.x = this.stage.scale.y = window.innerWidth / this.CanvasWidth;
    this.items = [];
    this.isMoving = false;
    this.lastTime = 0;
    this.isAnimate = false;
    this.beforeUpdate = {};
  }
  get CanvasWidth() { return 360; }
  get CanvasHeight() { return 640; }
  get ScreenWidth() { return 360; }
  get ScreenHeight() { return 640; }
  get CanvasWidthCenter() { return this.CanvasWidth / 2; }
  get CanvasHeightCenter() { return this.CanvasHeight / 2; }
  start() {
    this.isAnimate = true;
    this.lastTime = Date.now();
    this.update();
  }
  update() {
    for (var func in this.beforeUpdate) {
      this.beforeUpdate[func]();
    }
    if (!this.isAnimate) return;
    var currentTime = Date.now();
    var deltaTime = currentTime - this.lastTime;
    for (let i of this.items) {
      i.update(deltaTime);
    }
    this.lastTime = currentTime;
    requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.stage);
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
      this.app.stage.removeChildAt(i);
    }
    this.items = [];
  }
}
