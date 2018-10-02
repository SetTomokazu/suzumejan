// This is a JavaScript file

class PixiDialogOKCancel {
  static get DialogOK() { return 1; }
  static get DialogNG() { return 0; }

  constructor(word, player) {
    this.controls = [];
    this.dialogResult = -1;
    let bg = new PixiGraphics();
    this.controls.push(bg);
    this.player = player;

    let ok = new PixiLabel(word);
    ok.setPosition({ x: CENTER_X, y: CENTER_X - 50 });

    ok.setFunc(() => {
      this.dialogResult = PixiDialogOKCancel.DialogOK;
      this.player.setDialogResult(PixiDialogOKCancel.DialogOK);
      this.hide();
    });
    ok.setActive(true);
    this.controls.push(ok);
    let cancel = new PixiLabel("キャンセル");
    cancel.setPosition({ x: CENTER_X, y: CENTER_X + 50 });
    cancel.setFunc(() => {
      this.dialogResult = PixiDialogOKCancel.DialogNG;
      this.player.setDialogResult(PixiDialogOKCancel.DialogNG);
      this.hide();
    });
    cancel.setActive(true);
    this.controls.push(cancel);
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
