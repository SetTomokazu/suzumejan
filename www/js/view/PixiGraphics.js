// This is a JavaScript file

class PixiGraphics extends PixiObject {
  constructor(word) {
    super();
    this.view = new PIXI.Graphics();
    this.view.lineStyle(2, 0x0000FF, 1);
    this.view.beginFill(0xFFCCCC, 1);
    this.view.drawRect(this.bezel, this.bezel, CANVAS_WIDTH - 2 * this.bezel, CANVAS_WIDTH - 2 * this.bezel);
    this.view.alpha = 0.5;
  }
  get bezel() { return 140; }
}