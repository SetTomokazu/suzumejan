class PixiLabel extends PixiObject {
  constructor(word) {
    super();
    this.view = new PIXI.Text(word, new  PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      //fontStyle: 'italic',
      fontWeight: 'bold',
      //fill: ['#ffffff', '#00ff99'], // gradient
      fill: '#ffffff', // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440

    }));
    super.setCenter();
  }

  setText(txt) {
    this.view.text = txt;
  }
}