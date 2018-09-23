// This is a JavaScript file

class Button extends Label {
  constructor() {
    this.view = new PIXI.Text(word, { font: "36px/1.2 vt", fill: "white" });
    this.view.position.x = 18;
    this.view.position.y = CENTER_X * 1.5;
    this.view.anchor.x = 0.5;
    this.view.anchor.y = 0.5;
    ok.buttonMode = false;
    ok.interactive = false;
  }

  setFunc(func) {
    this.view.click = this.view.tap = func;
  }
}