//表示しているPixiObjectとその動きの管理
class Suzumejan {
  constructor() {
    this.items = [];
    this.init();
    this.deck = new Deck();
    this.state = 'waiting2EnterRoom';
    this.PM = new PlayerManager();
    this.roomId = 0;
    this.turn = -1;
    this.serverTurn = -1;
    this.event = null;
    this.skipper = new FrameSkipper();
  }
  init() {
    socket.on('room', (data) => {
      console.log(JSON.stringify(data));
      account.roomId = data.roomId;
      this.roomId = data.roomId;
    });
    socket.on('initRoomAndMembers', this.initRoomAndMembers.bind(this));
    socket.on('shuffle', this.initDeck.bind(this));
    socket.on('action', this.doAction.bind(this));
    socket.on('reaction', this.doReaction.bind(this));
    socket.on('ready2Draw', this.doNextDraw.bind(this));

    socket.emit('startTraining', account);
  }

  send(event, detail = {}) {
    console.log('send ' + event + ':' + JSON.stringify(detail));
    socket.emit(event, { roomId: account.roomId, playerName: account.playerName, detail: detail });
  }

  update() {
    switch (this.state) {
      case 'waiting2EnterRoom':
        if (this.PM.isReady) {
          this.send('shuffle');
          this.state = 'waiting4ReceiveDeck';
        }
        break;
      case 'waiting4ReceiveDeck':
        if (this.deck.isReady) {
          this.deck.setDora();
          this.state = 'firstDealing';
        }
        break;
      case 'firstDealing':
        if (this.skipper.hasSkipped) {
          this.PM.current().draw(this.deck.next);
          this.PM.step();
          if (this.PM.isDoneFirstDealing) {
            this.PM.announceDora(this.deck.dora);
            this.state = 'waitingFirstDealing';
          } else {
            this.skipper.init(5);
          }
        }
        break;
      case 'waitingFirstDealing':
        if (PD.hasMoved) {
          this.PM.sort();
          this.state = 'waitingFirstSort';
        }
        break;
      case 'waitingFirstSort':
        if (PD.hasMoved) {
          this.send('ready2Draw');
          this.state = 'dealing';
        }
        break;
      case 'dealing':
        if (this.turn < this.serverTurn) {//サーバから新しいターンを受信したら次へ進む
          if (this.deck.hasNext) {
            this.PM.current().draw(this.deck.next);
            if (this.PM.isMyTurn()) { // 自局の場合描画完了後に行動選択する
              this.state = 'waiting2Draw';
            } else { // 他局の場合描画完了にかかわらず行動選択結果を待つ
              this.state = 'wait2ReceiveAction';
            }
          } else {
            console.log("流局");
            this.dialog = new PixiDialogOK("流局");
            this.dialog.show();
            this.state = '流局';
          }
        }
        break;
      case 'waiting2Draw': //ツモ描画
        if (PD.hasMoved) {
          this.PM.current().start2Select();
          this.state = 'wait2SelectAction';
        }
        break;
      case 'wait2SelectAction':
        if (this.PM.current().hasSelectedAct) {
          this.event = null;
          this.send('action', this.PM.current().act);
          this.state = 'wait2ReceiveAction';
        }
        break;
      case 'wait2ReceiveAction':
        // 描画完了は待つ
        if (PD.hasMoved && this.event != null) {
          switch (this.event.action) {
            case 'waste':
              this.PM.current().waste(this.event.id);
              this.state = 'wait2Waste';
              break;
            case 'tsumo':
              console.log('鋭意製作中');
              break;
            default:
              break;
          }
        }
        break;
      case 'wait2Waste'://切り中
        if (PD.hasMoved) {
          this.event = null;
          if (this.PM.current().playerName === account.playerName) {
            //切ったのが自分の場合何もしない
            this.send('reaction', 'pass');
            this.state = 'wait2ReceiveReaction';
          } else {
            this.send('reaction', 'pass');
            this.state = 'wait2ReceiveReaction';
          }
        }
        break;
      case 'wait2ReceiveReaction':
        if (this.event != null) {
          if (this.event.every(e => e.reaction === 'pass')) {
            this.PM.step();
            this.send('ready2Draw');
            this.state = 'dealing';
          } else {

            this.PM.step();
            console.log('dada');
            this.state = 'dealing';
          }
        }
        break;
      case STATUS.ACTION:
        //捨牌を見て行動決定中
        if (vote >= PLAYER_NUM - 1) {
          if (this.PM.isdone()) {
            //誰かが上がっていた場合
            exec.finish.init();
            this.state = STATUS.FINISH;
          } else {
            //誰も上がっていない場合次へ
            this.PM.current().sort();
            this.PM.step();
            this.state = STATUS.DEALING;
          }
        }
        break;
      case STATUS.FINISH:
        //流局ないしアガリ描画
        if (exec.finish.execute()) {
          exec.init.init();
          this.state = STATUS.INIT;
        }
        break;
      case '流局':
        // サーバからの状態遷移待ち
        break;
      default:
        break;
    }
  }



  initRoomAndMembers(data) {
    console.log('initRoomAndMembers:' + JSON.stringify(data));
    this.roomId = data.roomId;
    account.roomId = data.roomId;
    this.PM.initMembers(account.playerName, data.members);
    PD.beforeUpdate.game = this.update.bind(this);
  }
  initDeck(data) {
    console.log('initDeck:' + JSON.stringify(data));
    this.deck.init(data.deck);
  }
  doNextDraw(data) {
    console.log('initDeck:' + JSON.stringify(data));
    this.serverTurn = data.turn;
    console.log('第' + data.turn + 'ツモっていいってよ！');
  }
  doAction(data) {
    console.log('doAction:' + JSON.stringify(data));
    if (this.PM.current().playerName === data.playerName) {
      console.log(data.playerName + 'さんが' + data.id + 'を捨てるそうです');
      this.event = data;
    } else {
      console.log("なんかやばい");
    }
  }
  doReaction(data) {
    console.log('doReaction:' + JSON.stringify(data));
    this.event = data;
    if (this.event.every(e => e.reaction === 'pass')) {
      this.PM.step();
      this.send('ready2Draw');
      this.state = 'dealing';
    } else {

      this.PM.step();
      console.log('dada');
      this.state = 'dealing';
    }

  }

}
