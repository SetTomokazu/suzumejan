class Deck {
  constructor() {
    this.deck = [];
    this.current = 0;
    this.dora = null;
  }

  init() {
    //表示していた牌を消す
    for (let d of this.deck) {
      d.hide();
    }
    this.deck = [];
    let first_pos = { x: CENTER_X + 0.55 * IMAGE_WIDTH * IMAGE_SCALE, y: CENTER_Y };
    for (let t of Base) {
      var p = new PixiPai(t);
      p.setPosition(first_pos);
      p.setSize({ w: IMAGE_WIDTH * IMAGE_SCALE, h: IMAGE_HEIGHT * IMAGE_SCALE });
      p.show();
      this.deck.push(p);
    }
    for (let i = this.deck.length - 1; i > 0; i--) {
      let r = Math.floor(Math.random() * (i + 1));
      let tmp = this.deck[i];
      this.deck[i] = this.deck[r];
      this.deck[r] = tmp;
    }
    this.current = 0;
  }

  get next() {
    var card = null;
    if (this.hasNext) {
      card = this.deck[this.current++];
    }
    return card;
  }
  get hasNext() {
    return this.current < this.deck.length;
  }
}
