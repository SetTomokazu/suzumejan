// This is a JavaScript file

const PLAYER_NUM = 4;
const STATUS = {
  //配牌準備中
  INIT: 0,
  //ドラ表示中
  READY: 1,
  //配牌中

  //リー牌中
  //ターン開始
  DEALING: 2,
  //自摸中
  TSUMO: 3,
  //選択街中
  SELECTING: 4,
  //ステ中
  SELECTED: 5,
  //他の人考え中
  ACTION: 6,
  //確定して手牌リー牌中
  //和了
  FINISH: 7,
  //流局
  RYUKYOKU: 8
};

const IMAGE_WIDTH = 66;
const IMAGE_HEIGHT = 90;
const IMAGE_SCALE = 0.8;
const IMAGE_SCALE_DISCARD = 0.4;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 920;
const CENTER_X = 320;
const CENTER_Y = 320;
var drawing_count = 0;
const CARD_SPEED = 15;