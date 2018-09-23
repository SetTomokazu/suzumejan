class Player {
  constructor(rot) {
    this.count = 0;
    this.total_score = 50;
    this.idx = rot;
    this.rot = -rot * Math.PI / 2;
    this.hand = [];
    this.request = 0;
    this.discard = [];
    this.has_ripai = true;
    this.scoreLabel = new Label("SCORE : " + this.total_score);
    this.scoreLabel.setRotation(this.rot);
    this.scoreLabel.setPosition( getScorePos(this.rot) );
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
    card.player = this;
    var pos = this.getHandsPos(this.hand.length, this.rot);
    card.hands_index = this.hand.length;
    this.hand.push(card);
    this.setPos2Card(card, pos.x, pos.y, this.rot, (this.idx == 0));
  }
  pass() {
    this.result.score = 0;
  }

  //手牌選択開始
  //自摸判定もここで行う
  start2Select() {
    this.selectedAction = 0;
    this.selectedIdx = -1;
    this.result = calc(this.hand);
    if (this.idx == 0) {
      for (let c of this.hand) {
        c.interactive = true;
      }
      if (this.result.score >= 5) {
        BB.showFinishDialogButton(this, "和了");
      }
    } else {
      //CPUの場合
      if (this.result.score >= 5) {
        this.selectedAction = 1;//ツモ
      } else {
        //ランダムで捨て牌決定
        this.selectedIdx = Math.floor(Math.random() * Math.floor(6));
      }
    }
  }
  isDone() {
    return this.result.score >= 5;
  }

  //自ターン時に常に呼ばれる状態管理者
  turn() {
    let result = false;
    if (this.selectedIdx >= 0) {
      let card = this.hand[this.selectedIdx];
      this.hand.splice(this.selectedIdx, 1);
      var pos = getDiscardPos(this.discard.length, this.rot);
      card.width = IMAGE_WIDTH * IMAGE_SCALE_DISCARD;
      card.height = IMAGE_HEIGHT * IMAGE_SCALE_DISCARD;
      this.setPos2Card(card, pos.x, pos.y, this.rot, true);
      waste = card;
      this.discard.push(card);
      result = true;
    } else if (this.selectedAction == 1) {
      for (let c of this.hand) {
        c.interactive = false;
      }
      result = true;
    } else {

    }
    return result;
  }
  //ユーザ入力によって選択された捨て牌
  select(idx) {
    this.selectedIdx = idx;
  }

  action(card) {
    var tmp = this.hand.concat();
    tmp.push(card);
    this.result = calc(tmp);
    if (this.idx == 0) {
      if (this.result.score >= 5) {
        console.log(this.result.score);
        let str = "";
        for (let x of tmp) {
          str += x.data + ",";
        }
        BB.showFinishDialogButton(this, "ロン");
      } else {
        vote += 1;
      }
    } else {
      if (this.result.score >= 5) {
        console.log("上がった人" + this.idx);
      }
      vote += 1;
    }
  }

  sort() {
    //sortする時点で手番は一通り終わっている
    this.result = null;
    this.hand.sort((a, b) => a.data - b.data);
    for (let i in this.hand) {
      this.hand[i].hands_index = i;
      this.hand[i].dest.position = this.getHandsPos(i, this.rot);
      this.hand[i].ismove = true;
    }
  }
  getHandsPos(idx, rot) {
    let pos = {};
    let x = (-2 + Number(((idx < 5) ? idx : idx + 0.3))) * IMAGE_WIDTH * IMAGE_SCALE;
    let y = 250;
    pos.x = x * Math.cos(rot) - (y * Math.sin(rot)) + CENTER_X;
    pos.y = x * Math.sin(rot) + (y * Math.cos(rot)) + CENTER_Y;
    return pos;
  }
  setPos2Card(card, x, y, rot, is_turn) {
    card.dest.position.x = x;
    card.dest.position.y = y;
    card.rotation = rot;
    if (is_turn) {
      card.texture = card.front;
    }
    card.ismove = true;
  }
  show() {

  }
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