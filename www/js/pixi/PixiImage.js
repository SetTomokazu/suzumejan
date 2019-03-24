// This is a JavaScript file

class PixiImage extends PixiObject {
  constructor(src) {
    super();
    this.texture = PIXI.Texture.fromImage(src);
    this.view = new PIXI.Sprite(this.texture);
    //this.view = new PIXI.Sprite.fromImage(src)
    super.setCenter();
  }
}