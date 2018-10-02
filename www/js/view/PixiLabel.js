class PixiLabel extends PixiObject {
  constructor(word) {
    super();
    this.view = new PIXI.Text(word, {
      font: "36px/1.2 vt",
      fill: "white",
      stroke: '#4a1850',
      strokeThickness: 5
    });
    super.setCenter();
  }

  setText(txt) {
    this.view.setText(txt);
  }
}