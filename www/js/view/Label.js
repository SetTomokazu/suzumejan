class Label extends PixiObject {
  constructor(word) {
    super();
    console.log("Label constructor");
    this.view = new PIXI.Text(word, { font: "36px/1.2 vt", fill: "white" });
    this.view.buttonMode = false;
    this.view.interactive = false;
    super.setCenter();
  }

  setText(txt) {
    this.view.setText(txt);
  }
}