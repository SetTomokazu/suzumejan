// This is a JavaScript file

class PlayerManager {
  constructor() {
    //今プレイしているユーザ
    this.user = null;
    this.players = [];
    this.idx = 0;
    this.oya = -1;
    this.players = [];
    for (let i = 0; i < PLAYER_NUM; i++) {
      this.players.push(new Player(i));
    }
    //今はとりあえず暫定で最初のプレイヤーにする
    this.user = this.players[0];
    this.idx = 0;
  }
  get currentIdx() { return this.idx; }

  init() {
    this.oya++;
    this.oya %= PLAYER_NUM;
    this.idx = this.oya;
    for (let p of this.players) {
      p.reset();
    }
  }

  //現在のプレイヤーを取得する
  current() {
    return this.players[this.idx];
  }

  //プレイヤーを次に進める
  step() {
    this.idx = (this.idx + 1) % PLAYER_NUM;
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