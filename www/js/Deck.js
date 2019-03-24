class Deck {
  constructor() {
    this.deck = [];
    this.current = 0;
    this.dora = null;
    this.hasReceived = false;
  }

  init(ary) {
    this.clear();
    this.deck = [];
    let first_pos = { x: PD.CanvasWidth * 0.6, y: PD.CanvasHeightCenter };
    console.log(JSON.stringify(first_pos));
    for (let t of ary) {
      var p = new PixiPai(t.id);
      p.setPosition(first_pos.x, first_pos.y);
      p.show();
      this.deck.push(p);
    }
    this.current = 0;
    this.hasReceived = true;
  }
  clear() {
    //表示していた牌を消す
    for (let d of this.deck) {
      d.hide();
    }
  }

  setDora() {
    this.dora = this.next;
    this.dora.setDest(PD.CanvasWidth * 0.4, PD.CanvasHeightCenter);
    this.dora.faceUp();
    console.log(JSON.stringify(this.dora.size));
  }

  get isReady() {
    return this.hasReceived;
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
