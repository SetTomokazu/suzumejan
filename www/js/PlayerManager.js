// This is a JavaScript file

class PlayerManager {
  constructor() {
    //今プレイしているユーザ
    this.user = null;
    this.players = [];
    this.idx = 0;
    this.oya = -1;
  }
  get currentIdx() { return this.idx; }
  get isReady() { return this.players.length === 4; }
  get isDoneFirstDealing() { return this.players.every(p => p.hand.length === 5); }
  init() {
    this.oya++;
    this.oya %= PLAYER_NUM;
    this.idx = this.oya;
    for (let p of this.players) {
      p.reset();
    }
  }
  initMembers(myName, members) {
    this.players = [];
    console.log('initMembers of' + myName);
    switch (true) {
      case members.find(m => m.sheet === 'east').name === myName:
        this.players.push(new Player(members.find(m => m.sheet === 'east').name, 0));
        this.players.push(new Player(members.find(m => m.sheet === 'south').name, 1));
        this.players.push(new Player(members.find(m => m.sheet === 'west').name, 2));
        this.players.push(new Player(members.find(m => m.sheet === 'north').name, 3));
        console.log('東');
        break;
      case members.find(m => m.sheet === 'south').name === myName:
        this.players.push(new Player(members.find(m => m.sheet === 'east').name, 3));
        this.players.push(new Player(members.find(m => m.sheet === 'south').name, 0));
        this.players.push(new Player(members.find(m => m.sheet === 'west').name, 1));
        this.players.push(new Player(members.find(m => m.sheet === 'north').name, 2));
        console.log('南');
        break;
      case members.find(m => m.sheet === 'west').name === myName:
        this.players.push(new Player(members.find(m => m.sheet === 'east').name, 2));
        this.players.push(new Player(members.find(m => m.sheet === 'south').name, 3));
        this.players.push(new Player(members.find(m => m.sheet === 'west').name, 0));
        this.players.push(new Player(members.find(m => m.sheet === 'north').name, 1));
        console.log('西');
        break;
      case members.find(m => m.sheet === 'north').name === myName:
        this.players.push(new Player(members.find(m => m.sheet === 'east').name, 1));
        this.players.push(new Player(members.find(m => m.sheet === 'south').name, 2));
        this.players.push(new Player(members.find(m => m.sheet === 'west').name, 3));
        this.players.push(new Player(members.find(m => m.sheet === 'north').name, 0));
        console.log('北');
        break;
      default:
        break;
    }
    this.idx = 0;
  }

  //現在のプレイヤーを取得する
  current() {
    return this.players[this.idx];
  }
  me() {
    return this.players.find(p => p.playerName === account.playerName);
  }
  isMyTurn() {
    return this.current().playerName === this.me().playerName;
  }
  //プレイヤーを次に進める
  step() {
    this.idx = (this.idx + 1) % PLAYER_NUM;
  }

  // ドラをプレイヤーに告知する
  announceDora(dora) {
    for (let p of this.players) {
      p.dora = dora;
    }
  }
  sort() {
    for (let p of this.players) {
      p.sort();
    }
  }

  isdone() {
    return this.players.some(p => p.result.score >= 5);
  }

  others() {
    var p = [];
    for (let i = this.idx + 1; i % PLAYER_NUM != this.idx; i++) {
      p.push(this.players[i % PLAYER_NUM]);
    }
    return p;
  }
}