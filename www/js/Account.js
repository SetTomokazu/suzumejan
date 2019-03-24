// This is a JavaScript file

class Account {
  constructor() {
    this.playerName = '';
    this.id = '';
    this.roomId = '';
  }
  load() {
    var act = localStorage.getItem('account');
    if (act !== null && act !== undefined) {
      let data = JSON.parse(act);
      this.playerName = data.playerName;
      this.id = data.id;
    }
  }
  save() {
    localStorage.setItem('account', JSON.stringify(this));
  }
}

