// This is a JavaScript file

// This is a JavaScript file

class SignIn extends BaseView {
  constructor() {
    super();
    this.html = '<input type="text" class="username" id="username" float placeholder="player name" maxlength="20" autocomplete="off"></ons-input>';
    this.elements.solo = new PixiLabel("SignIn");
    this.elements.solo.setFunc(this.login.bind(this));
    this.elements.solo.setPosition(PD.ScreenWidth / 2, PD.ScreenHeight * 0.6);
    socket.on('login', this.callback.bind(this));
  }
  show() {
    super.show();
    document.getElementById('signin').insertAdjacentHTML('afterbegin', this.html);
    document.getElementById('username').style.visibility = true;
    this.elements.solo.setActive(true);
  }
  hide() {
    var elm = document.getElementById('signin');
    elm.parentNode.removeChild(elm);
    this.elements.solo.setFunc(null);
    super.hide();
  }

  login() {
    document.getElementById('username').setAttribute("disabled", "disabled");
    this.elements.solo.setActive(false);
    let playerName = document.getElementById('username').value;
    console.log('Try login as ' + playerName);
    //ログイン結果取得時の処理
    socket.emit('login', playerName);
  }

  callback(data) {
    console.log('login result ' + JSON.stringify(data));
    if (data.result == 'success') {
      account.playerName = data.username;
      console.log(account.playerName);
      document.getElementById('username').style.visibility = false;
      this.stack.pop();
    } else {
      document.getElementById('username').value = "";
      document.getElementById('username').removeAttribute("disabled");
    }
  }

  startGame() {
    console.log("show");
  }

}