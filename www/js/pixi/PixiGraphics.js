// This is a JavaScript file

class PixiGraphics extends PixiObject {
  constructor(word) {
    super();
    this.view = new PIXI.Graphics();
    this.view.lineStyle(2, 0x0000FF, 1);
    this.view.beginFill(0xFFCCCC, 1);
    this.view.drawRect(
      this.fillLeft,
      (PD.CanvasHeightCenter - PD.CanvasWidthCenter) + PD.CanvasWidth * (1 - this.fillRate) / 2,
      this.fillWidth,
      this.fillHeight
    );
    this.view.endFill();
    this.view.alpha = 0.5;
  }
  get fillLeft() { return PD.CanvasWidth * (1 - this.fillRate) / 2; }
  get fillWidth() { return PD.CanvasWidth * this.fillRate; }
  get fillHeight() { return this.fillWidth; }
  get fillRate() { return 0.9; }
  get bezel() { return 140; }
}
