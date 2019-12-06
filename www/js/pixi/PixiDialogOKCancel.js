// This is a JavaScript file

class PixiDialogOKCancel {
  constructor(word, callbackOK, callbackNG) {
    this.controls = [];
    this.dialogResult = -1;
    let bg = new PixiGraphics();
    this.controls.push(bg);

    let ok = new PixiLabel(word);
    ok.setPosition(PD.CanvasWidthCenter, PD.CanvasHeightCenter - 50);

    ok.setFunc(() => {
      callbackOK();
      this.hide();
    });
    ok.setActive(true);
    this.controls.push(ok);
    let cancel = new PixiLabel("キャンセル");
    cancel.setPosition(PD.CanvasWidthCenter, PD.CanvasHeightCenter + 50);
    cancel.setFunc(() => {
      callbackNG();
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
