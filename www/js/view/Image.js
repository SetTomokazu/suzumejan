// This is a JavaScript file

class Image extends PixiObject {
  constructor(src) {
    super();
    this.texture = PIXI.Texture.fromImage(src, true);
    this.view = new PIXI.Sprite(this.texture);
    super.setCenter();
  }
}