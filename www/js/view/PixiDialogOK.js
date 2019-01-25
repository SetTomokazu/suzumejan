class PixiDialogOK {
  static get DialogOK() { return 1; }

  constructor(word, callback) {
    this.controls = [];
    this.dialogResult = -1;
    let bg = new PixiGraphics();
    this.controls.push(bg);

    let ok = new PixiLabel(word);
    ok.setPosition({ x: CENTER_X, y: CENTER_X });

    ok.setFunc(() => {
      this.dialogResult = PixiDialogOK.DialogOK;
      this.hide();
    });
    ok.setActive(true);
    this.controls.push(ok);
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
