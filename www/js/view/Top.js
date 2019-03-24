// This is a JavaScript file

class Top extends BaseView {
  constructor() {
    super();
    this.elements.solo = new PixiLabel("一人用");
    this.elements.solo.setFunc(this.startGame.bind(this));
    this.elements.solo.setPosition(PD.ScreenWidth / 2, PD.ScreenHeight / 2);
    this.elements.title = new PixiLabel("ようこそ " + account.playerName + "さん");
    this.elements.title.setPosition(PD.ScreenWidth / 2, PD.ScreenHeight / 4);
  }
  show() {
    if (account.playerName == "") {
      this.stack.push(new SignIn());
    } else {
      this.elements.title.setText("ようこそ " + account.playerName + "さん");
      super.show();
      this.elements.solo.setActive(true);
    }
  }
  hide(){
    this.elements.solo.setActive(false);
    super.hide();
  }
  startGame() {
    console.log("show");
    this.stack.push(new Solo());
  }

}