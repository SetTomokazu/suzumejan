// This is a JavaScript file
class PixiPai extends PixiObject {
  constructor(cardId) {
    super();
    this.back = PIXI.Texture.fromImage("img/back.png", true);
    this.front = PIXI.Texture.fromImage(Base[cardId].img, true);
    this.view = new PIXI.Sprite(this.back);
    super.setCenter();
    this.id = cardId;
    this.data = Number(Base[cardId].data);
    this.dora = Number(Base[cardId].dora);
  }

  faceUp() {
    this.view.texture = this.front;
    this.setSize(this.size)
  }

  faceDown() {
    this.view.texture = this.back;
    this.setSize(this.size)
  }
}
