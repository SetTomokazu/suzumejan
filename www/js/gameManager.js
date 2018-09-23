class GameManager {
  constructor() {
    this.state = STATUS.INIT;
    this.deck = null;
  }
  init() {
    //プレイヤー初期化
    this.deck = new Deck();
    this.deck.shuffle();
    this.state = STATUS.INIT;
  }
}