// This is a JavaScript file
class PixiPai extends PixiObject {
  constructor(card) {
    super();
    this.back = PIXI.Texture.fromImage("img/back.png", true);
    this.front = PIXI.Texture.fromImage(card.img, true);
    this.view = new PIXI.Sprite(this.back);
    super.setCenter();
    this.data = Number(card.data);
    this.dora = Number(card.dora);
    
  }

  faceUp() {
    this.view.texture = this.front;
  }

  faceDown() {
    this.view.texture = this.back;
  }
}
