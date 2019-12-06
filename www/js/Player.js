class Player {
  constructor(name, rot) {
    this.playerName = name;
    this.count = 0;
    this.total_score = 50;
    this.idx = parseInt(rot);
    this.rot = -1 * parseInt(rot) * Math.PI / 2;
    this.hand = [];
    this.discard = [];
    this.request = 0;
    this.scoreLabel = new PixiLabel(this.playerName + " : " + this.total_score);
    let p = getScorePos(this.rot);
    this.scoreLabel.setPosition(p.x, p.y);
    this.scoreLabel.setRotation(this.rot);
    this.scoreLabel.show();

    this.result = null;

    this.hasSelectedAct = false;
  }

  reset() {
    for (let c of this.hand) c.hide();
    for (let d of this.discard) d.hide();
    this.hand = [];
    this.discard = [];
  }
  addScore(val) {
    this.total_score += parseInt(val);
    this.scoreLabel.setText(this.playerName + " : " + this.total_score);
  }
  draw(card, delay = 0) {

    this.hand.push(card);
    card.setRotation(this.rot);
    let p = this.getHandsPos(this.hand.length - 1);
    card.setDest(p.x, p.y, delay);
  }
  pass() {
    this.result.score = 0;
  }

  //手牌選択開始
  //自摸判定もここで行う
  start2Select(callback) {
    if (this.idx === 0) {
      //自キャラ(一番下の人)の場合手牌を見せる
      for (let card of this.hand) { card.faceUp(); }
    } else {
      for (let card of this.hand) { card.faceUp(); }
    }
    this.hasSelectedAct = false;
    this.result = calc(this.hand, this.dora.data);

    //手牌選択可能にする
    this.setHandsActive(true, callback);
    if (this.result.score >= 5) {
      this.dialog = new PixiDialogOKCancel(
        "和了",
        () => { callback({ 'action': 'tsumo', 'user': this.playerName }); },
        () => { });
      this.dialog.show();
    }
  }
  open() {
    for (let i of this.hand) {
      i.faceUp();
    }
  }
  close() {
    for (let i of this.hand) {
      i.faceDown();
    }
  }
  isDone() {
    return this.result.score >= 5;
  }
  get WASTE_CARD_SIZE() { return { w: IMAGE_WIDTH * IMAGE_SCALE_DISCARD, h: IMAGE_HEIGHT * IMAGE_SCALE_DISCARD } }

  waste(id) {
    let idx = this.hand.findIndex(c => c.id === id);
    let card = this.hand[idx];
    this.hand.splice(idx, 1);
    var pos = this.getNextDiscardPos();
    card.setDest(pos.x, pos.y);
    card.setSizeSmall();
    card.faceUp();
    this.discard.push(card);
    this.sort();
  }

  //ユーザ入力によって選択された捨て牌
  select(obj) {
    console.log("select");
    if (this.hasSelectedAct) return;
    this.hasSelectedAct = true;
    this.setHandsActive(false);
    this.selectedIdx = this.hand.findIndex(h => h === obj);
    this.act = { action: 'waste', user: this.playerName, id: obj.id };
    if (this.callback !== undefined) {
      this.callback({ 'action': 'waste', 'user': this.playerName, 'id': obj.id });
      this.callback = undefined;
    }
  }

  setHandsActive(b, callback = undefined) {
    if (b) {
      for (let i in this.hand) {
        this.callback = callback;
        this.hand[i].setFunc(this.select.bind(this, this.hand[i]));
        this.hand[i].setActive(true);
      }
    } else {
      for (let c of this.hand) {
        c.interactive = false;
      }
    }
  }

  setDialogResult(r) {
    this.selectedAction = r;
    if (this.selectedAction == PixiDialogOKCancel.DialogNG) {
      //キャンセルの場合は点数計算結果を破棄する
      this.pass();
    }
  }

  action(card) {
    let temp = this.hand.concat();
    temp.push(card);
    this.result = calc(temp, this.dora.data);
    if (this.idx == 0) {
      if (this.result.score >= 5) {
        let str = "";
        for (let x of tmp) {
          str += x.data + ",";
        }
        let f = (data) => {
          this.selectedAction = 1;
        }
        this.dialog = new PixiDialogOKCancel("ロン", this);

        this.dialog.show();
      } else {
        vote += 1;
      }
    } else {
      vote += 1;
    }
  }

  sort() {
    //sortする時点で手番は一通り終わっている
    this.result = null;
    this.hand.sort((a, b) => a.id - b.id);
    for (let i in this.hand) {
      let p = this.getHandsPos(i);
      this.hand[i].setDest(p.x, p.y);
    }
  }

  getHandsPos(idx) {
    let pos = {};
    let x = (-2 + Number(((idx < 5) ? idx : idx + 0.3))) * PixiPai.normalWidth;
    let y = PD.CanvasWidthCenter * 0.81;
    pos.x = x * Math.cos(this.rot) - (y * Math.sin(this.rot)) + PD.CanvasWidthCenter;
    pos.y = x * Math.sin(this.rot) + (y * Math.cos(this.rot)) + PD.CanvasHeightCenter;
    return pos;
  }

  getNextDiscardPos() {
    let idx = this.discard.length;
    var pos = {};
    let x = (-3 + Number(idx) % 6) * PixiPai.smallWidth;
    let y = PD.CanvasWidthCenter * 0.4 + Math.floor(idx / 6) * PixiPai.smallHeight;
    pos.x = x * Math.cos(this.rot) - (y * Math.sin(this.rot)) + PD.CanvasWidthCenter;
    pos.y = x * Math.sin(this.rot) + (y * Math.cos(this.rot)) + PD.CanvasHeightCenter;
    return pos;
  }

}


const getScorePos = (rot) => {
  var pos = {};
  let x = IMAGE_WIDTH * IMAGE_SCALE_DISCARD;
  let y = PD.CanvasWidthCenter * 0.8;
  pos.x = x * Math.cos(rot) - (y * Math.sin(rot)) + PD.CanvasWidthCenter;
  pos.y = x * Math.sin(rot) + (y * Math.cos(rot)) + PD.CanvasHeightCenter;
  return pos;
}