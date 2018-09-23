class Deck {
  constructor() {
    this.deck = [];
    this.current = 0;
  }

  init() {
    this.deck = [];
    let first_pos = { x: CENTER_X + 0.55 * IMAGE_WIDTH * IMAGE_SCALE, y: CENTER_Y };
    for (let t of Base) {
      var p = new Pai();
      p.setCard(t);
      p.setPosition(first_pos);
      p.setSize(IMAGE_WIDTH * IMAGE_SCALE, IMAGE_HEIGHT * IMAGE_SCALE);
      p.show();
      this.deck.push(p);
    }
    for (let i = this.deck.length - 1; i > 0; i--) {
      let r = Math.floor(Math.random() * (i + 1));
      let tmp = this.deck[i];
      this.deck[i] = this.deck[r];
      this.deck[r] = tmp;
    }
  }

  shuffle() {
    var tmp = Base.concat();

    var selected = new Array(tmp.length).fill(tmp.length);
    var i = 0;
    console.log("shuffle start");
    for (let d in tmp) {
      do {
        i = Math.floor(Math.random() * tmp.length);
      } while (selected.some(s => s == i));
      selected[d] = i;
      var card = BB.addBlock(CENTER_X + 0.55 * IMAGE_WIDTH * IMAGE_SCALE, CENTER_Y, 0, tmp[i], false);
      this.deck.push(card);
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
