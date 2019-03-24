
class LoginDialog {
  constructor() {
    this.dialogName = 'login.html';
    this.username = '';
    this.password = '';
  }
  show() {
    ons.createDialog(this.dialogName).then(dialog => {
      this.dialog = dialog;
      this.dialog.show();
    });
  }
  hide() {
    this.username = document.getElementById('username').value;
    this.password = document.getElementById('password').value;
    console.log(this.username);
    console.log(this.password);
    socket.on('login', (data) => {
      console.log('login result ' + data);
      account.playerName = this.username;
      console.log(account.playerName);
      //let content = document.getElementById('navigator');
      //content.resetToPage('home.html', { animation: 'slide' });
      this.dialog.hide();
    });
    socket.emit('login', this.username);
  }
}