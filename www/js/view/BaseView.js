// This is a JavaScript file

class BaseView {
  constructor() {
    this.background = new PixiImage("img/logo.png");
    this.background.setPosition(PD.ScreenWidth / 2, PD.ScreenHeight / 2);
    this.background.setSize(PD.CanvasWidth, PD.CanvasWidth);
    this.elements = {};
  }
  setStack(stack) {
    this.stack = stack;
  }
  show() {
    this.background.show();
    for (let c in this.elements) {
      this.elements[c].show();
    }
  }
  hide() {
    for (let c in this.elements) {
      this.elements[c].hide();
    }
    this.background.hide();
  }
}