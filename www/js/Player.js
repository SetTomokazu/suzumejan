class Player {
  constructor(rot) {
    this.count = 0;
    this.total_score = 50;
    this.idx = rot;
    this.rot = -rot * Math.PI / 2;
    this.hand = [];
    this.discard = [];
    this.request = 0;
    this.scoreLabel = new PixiLabel("SCORE : " + this.total_score);
    this.scoreLabel.setRotation(this.rot);
    this.scoreLabel.setPosition(getScorePos(this.rot));
    this.scoreLabel.show();

    this.result = null;
    this.selectedAction = 0;
    //ユーザによって選択された捨て牌
    this.selectedIdx = 0;
  }

  reset() {
    this.hand = [];
    this.discard = [];
  }
  addScore(val) {
    this.total_score += parseInt(val);
    this.scoreLabel.setText("SCORE : " + this.total_score);
  }
  draw(card) {
    var pos = getHandsPos(this.hand.length, this.rot);
    this.hand.push(card);
    card.setRotation(this.rot);
    card.setDest(pos);
    if (this.idx === 0) {
      card.faceUp();
    }
  }
  pass() {
    this.result.score = 0;
  }

  //手牌選択開始
  //自摸判定もここで行う
  start2Select() {
    this.selectedAction = PixiDialogOKCancel.DialogNG;//キャンセル
    this.selectedIdx = -1;
    this.result = calc(this.idx, this.hand);
    if (this.idx == 0) {

      for (let i in this.hand) {

        this.hand[i].player = this;
        this.hand[i].idx = i;
        let f = (data) => {
          this.select(this.hand[i].idx);
        };
        this.hand[i].setFunc(f);
        this.hand[i].setActive(true);
      }
      if (this.result.score >= 5) {
        this.selectedAction = -1;
        this.dialog = new PixiDialogOKCancel("和了", this);
        this.dialog.show();
      }
    } else {
      //CPUの場合
      if (this.result.score >= 5) {
        this.selectedAction = 1;//ツモ
      } else {
        //ランダムで捨て牌決定
        this.selectedIdx = Math.floor(Math.random() * 6);
      }
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

  //自ターン時に常に呼ばれる状態管理者
  turn() {
    let result = false;
    switch (this.selectedAction) {
      case -1:
        //行動未選択の為待機中
        break;

      case PixiDialogOKCancel.DialogNG://キャンセル
        if (this.selectedIdx >= 0) {
          let card = this.hand[this.selectedIdx];
          this.hand.splice(this.selectedIdx, 1);
          var pos = getDiscardPos(this.discard.length, this.rot);
          card.setDest(pos);
          card.setSize(this.WASTE_CARD_SIZE);
          card.faceUp();
          waste = card;
          this.discard.push(card);
          result = true;
        }
        break;

      case PixiDialogOKCancel.DialogOK: //ツモ
        for (let c of this.hand) {
          c.interactive = false;
        }
        result = true;
        break;
      default:
        break;
    }
    return result;
  }
  //ユーザ入力によって選択された捨て牌
  select(idx) {
    this.selectedIdx = idx;
  }

  setDialogResult(r) {
    this.selectedAction = r;
    vote++;
    if (this.selectedAction == PixiDialogOKCancel.DialogNG) {
      //キャンセルの場合は点数計算結果を破棄する
      this.pass();
    }
  }

  action(card) {
    var tmp = this.hand.concat();
    tmp.push(card);
    this.result = calc(this.idx, tmp);
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
    this.hand.sort((a, b) => a.data - b.data);
    for (let i in this.hand) {
      this.hand[i].setDest(getHandsPos(i, this.rot));
    }
  }
}

const getHandsPos = (idx, rot) => {
  let pos = {};
  let x = (-2 + Number(((idx < 5) ? idx : idx + 0.3))) * IMAGE_WIDTH * IMAGE_SCALE;
  let y = 250;
  pos.x = x * Math.cos(rot) - (y * Math.sin(rot)) + CENTER_X;
  pos.y = x * Math.sin(rot) + (y * Math.cos(rot)) + CENTER_Y;
  return pos;
}

const getDiscardPos = (idx, rot) => {
  var pos = {};
  let x = (-3 + Number(idx) % 6) * IMAGE_WIDTH * IMAGE_SCALE_DISCARD;
  let y = 100 + Math.floor(idx / 6) * IMAGE_HEIGHT * IMAGE_SCALE_DISCARD;
  pos.x = x * Math.cos(rot) - (y * Math.sin(rot)) + CENTER_X;
  pos.y = x * Math.sin(rot) + (y * Math.cos(rot)) + CENTER_Y;
  return pos;
}
const getScorePos = (rot) => {
  var pos = {};
  let x = IMAGE_WIDTH * IMAGE_SCALE_DISCARD;
  let y = 200;
  pos.x = x * Math.cos(rot) - (y * Math.sin(rot)) + CENTER_X;
  pos.y = x * Math.sin(rot) + (y * Math.cos(rot)) + CENTER_Y;
  return pos;
}