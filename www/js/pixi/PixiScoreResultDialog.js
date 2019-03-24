// This is a JavaScript file

class PixiScoreResultDialog {
  static get DialogOK() { return 1; }

  constructor(detail, score, exec) {
    this.controls = [];
    this.exec = exec;
    let bg = new PixiGraphics();
    this.controls.push(bg);


    let label = new PixiLabel(detail.join("\r\n"));
    label.setPosition({ x: CENTER_X, y: CENTER_X - 50 });
    this.controls.push(label);

    for (let i = 0; i < PLAYER_NUM; i++) {
      if ('_' + String(i) in score) {
        let lbl = new PixiLabel(score["_" + String(i)]);
        lbl.setPosition(this.scorePos(i));
        lbl.setRotation(this.rotate(i));
        this.controls.push(lbl);
      }
    }


    let ok = new PixiLabel("OK");
    ok.setPosition({ x: CENTER_X, y: CENTER_X + 120 });

    ok.setFunc(() => {
      this.exec.ok = true;
      this.hide();
    });
    ok.setActive(true);
    this.controls.push(ok);
  }
  rotate(idx) { return -Number(idx) * Math.PI / 2; }
  scorePos(idx) {
    let pos = {};
    let rot = this.rotate(idx);
    let x = 0;
    let y = 150;
    pos.x = x * Math.cos(rot) - (y * Math.sin(rot)) + CENTER_X;
    pos.y = x * Math.sin(rot) + (y * Math.cos(rot)) + CENTER_Y;
    return pos;
  }


  show() {
    for (let i of this.controls) {
      i.show();
    }
  }
  hide() {
    for (let i of this.controls) {
      i.hide();
    }
  }
}
