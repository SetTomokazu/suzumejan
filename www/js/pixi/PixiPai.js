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
    this.setSizeNomal();
  }

  static get OriginalWidth() { return 66; }
  static get OriginalHeight() { return 90; }
  static get normalWidth() { return PixiPai.OriginalWidth * 0.5; }
  static get normalHeight() { return PixiPai.OriginalHeight * 0.5; }
  static get smallWidth() { return PixiPai.OriginalWidth * 0.3; }
  static get smallHeight() { return PixiPai.OriginalHeight * 0.3; }
  setSizeNomal() { this.setSize(PixiPai.normalWidth, PixiPai.normalHeight); }
  setSizeSmall() { this.setSize(PixiPai.smallWidth, PixiPai.smallHeight); }

  faceUp() {
    this.view.texture = this.front;
    this.setSize(this.size.w, this.size.h);
  }

  faceDown() {
    this.view.texture = this.back;
    this.setSize(this.size.w, this.size.h);
  }
}
