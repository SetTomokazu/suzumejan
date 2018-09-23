var state = STATUS.INIT;
var deck;
//PIXI
var BB = null;
//PlayerManager
var PM = null;
const exec = {
  init: new InitExecuter(),
  finish: new FinishExecuter()
}
window.onload = function () {
  if (getUa() === false) init();
  else document.addEventListener("deviceready", init, false);
}

var init = () => {
  BB = new DrawManager();
  BB.init();
  BB.reset();
  PM = new PlayerManager();
  PM.init();
  state = STATUS.INIT;
  deck = new Deck();
  console.log("PM.init");
  //deck.init();
  deck.shuffle();
  BB.renderer.render(BB.stage);   // 描画する
  requestAnimFrame(update);
}


var lastTime = 0;
var vote = 0;
var finisher = [];
//捨牌
var waste = null;


var update = (time) => {
  var deltaTime = 0;
  if (lastTime) {
    deltaTime = time - lastTime;
  }
  lastTime = time;

  BB.move(deltaTime);

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
        exec.init.init();
        state = STATUS.INIT;
      }
      break;
    case STATUS.TSUMO:
      //ツモ
      if (BB.hasMoved()) {
        PM.current().start2Select();
        state = STATUS.SELECTING;
      }
      break;
    case STATUS.SELECTING:
      if (PM.current().turn()) {
        if (PM.current().isDone()) {
          //積もったのでFinish
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
          exec.finish.init();
          state = STATUS.FINISH;
        } else {
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
    default:
      break;
  }
  requestAnimFrame(update);
  BB.renderer.render(BB.stage);   // 描画する
}


var doDealing = () => {
  PM.current().draw(deck.next);
  state = STATUS.TSUMO;
}

var doSelected = () => {
  var result = false;
  if (BB.hasMoved()) {
    vote = 0;
    finisher = [];
    for (let p of PM.others()) {
      p.action(waste);
    }
    result = true;
  }
  return result;
}