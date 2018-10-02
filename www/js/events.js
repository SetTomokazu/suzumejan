var state = STATUS.INIT;
var deck;
//PIXI
var BB = null;
//PlayerManager
var PM = null;
const exec = {
  init: new InitExecuter(),
  finish: new FinishDirector()
}
window.onload = function () {
  if (getUa() === false) init();
  else document.addEventListener("deviceready", init, false);
}


var init = () => {
  PD = new PixiDirector();
  PM = new PlayerManager();
  state = STATUS.INIT;
  deck = new Deck();
  deck.init();
  requestAnimFrame(update);
  PD.renderer.render(PD.stage);   // 描画する
}


var lastTime = 0;
var vote = 0;
var finisher = [];
//捨牌
var waste = null;
let dialog = null;

var update = (time) => {
  var deltaTime = 0;
  if (lastTime) {
    deltaTime = time - lastTime;
  }
  lastTime = time;

  PD.update(deltaTime);

  switch (state) {
    case STATUS.INIT:
      if (exec.init.execute()) {
        state = STATUS.DEALING;
      }
      break;
    case STATUS.DEALING:
      if (deck.hasNext) {
        doDealing();
      } else {
        console.log("流局");
        dialog = new PixiDialogOK("流局");
        dialog.show();
        state = STATUS.RYUKYOKU;
      }
      break;
    case STATUS.TSUMO:
      //ツモ
      if (PD.hasMoved()) {
        PM.current().start2Select();
        state = STATUS.SELECTING;
      }
      break;
    case STATUS.SELECTING:
      if (PM.current().turn()) {
        if (PM.current().isDone()) {
          //積もったのでFinish
          exec.finish.init();
          state = STATUS.FINISH;
        } else {
          state = STATUS.SELECTED;
        }
      }
      //手牌選択中
      // タップイベントとplayer内でステータス進行
      break;
    case STATUS.SELECTED:
      //捨牌中
      if (doSelected()) {
        state = STATUS.ACTION;
      }
      break;
    case STATUS.ACTION:
      //捨牌を見て行動決定中
      if (vote >= PLAYER_NUM - 1) {
        if (PM.isdone()) {
          //誰かが上がっていた場合
          exec.finish.init();
          state = STATUS.FINISH;
        } else {
          //誰も上がっていない場合次へ
          PM.current().sort();
          PM.step();
          state = STATUS.DEALING;
        }
      }
      break;
    case STATUS.FINISH:
      //流局ないしアガリ描画
      if (exec.finish.execute()) {
        exec.init.init();
        state = STATUS.INIT;
      }
      break;
    case STATUS.RYUKYOKU:
      //OK承認待ち
      if (dialog.dialogResult == PixiDialogOK.DialogOK) {
        exec.init.init();
        state = STATUS.INIT;
      }
      break;
    default:
      break;
  }
  requestAnimFrame(update);
  PD.renderer.render(PD.stage);   // 描画する
}


var doDealing = () => {
  PM.current().draw(deck.next);
  state = STATUS.TSUMO;
}

var doSelected = () => {
  var result = false;
  if (PD.hasMoved()) {
    vote = 0;
    finisher = [];
    for (let p of PM.others()) {
      p.action(waste);
    }
    result = true;
  }
  return result;
}