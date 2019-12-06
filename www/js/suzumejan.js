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
    this.eventQueue = [];
    this.isAnim = false;
    this.isDuringEvent = false;
  }
  init() {
    socket.on('room', (data) => {
      console.log(JSON.stringify(data));
      account.roomId = data.roomId;
      this.roomId = data.roomId;
    });
    socket.on('initRoomAndMembers', this.initRoomAndMembers.bind(this));
    socket.on('shuffle', this.receiveShuffledDeck.bind(this));
    socket.on('action', this.doAction.bind(this));
    socket.on('reaction', this.doReaction.bind(this));
    socket.on('draw', this.doNextDraw.bind(this));
    socket.on('done', this.endTable.bind(this));

    socket.emit('startTraining', account);
  }

  send(event, detail = {}) {
    console.log('send ' + event + ':' + JSON.stringify(detail));
    socket.emit(event, { roomId: account.roomId, playerName: account.playerName, detail: detail });
  }

  update() {
    if (PD.hasMoved) {
      if (this.eventQueue.length > 0) {
        var ev = this.eventQueue.pop();
        console.log(JSON.stringify(ev));
        this.executeEvent(ev);
      }
    }
  }

  // イベント登録
  queueEvent(ev) {
    this.eventQueue.unshift(ev);
  }

  receiveEvent(data) {
    // Herokuからイベントを受信した際に呼ばれる
    this.eventQueue.unshift(data);
    if (!this.isAnim) {
      // アニメーション中ではない場合、イベントを実行する
      var ev = this.eventQueue.pop();
      this.executeEvent(ev);
    }
    else {
      // アニメーション中の場合終わるまで待機して、完了後に呼んでもらう
    }
  }

  // イベント振り分け
  executeEvent(data) {
    if (data.event in this) {
      // 登録済みならそれを実行
      this[data.event](data);
    } else {
      // 無いならログ出し
      console.log('未登録イベント' + data.event);
    }
  }

  initRoomAndMembers(data) {
    console.log('initRoomAndMembers:' + JSON.stringify(data));
    this.roomId = data.roomId;
    account.roomId = data.roomId;
    this.PM.initMembers(account.playerName, data.members);
    PD.beforeUpdate.game = this.update.bind(this);
    this.queueEvent({ "event": "requestShuffledDeck" });
  }

  doNextDraw(data) { this.queueEvent(data); }

  doAction(data) {
    this.queueEvent(data);
  }

  doReaction(data) {
    console.log('doReaction:' + JSON.stringify(data));
    this.queueEvent(data);
  }

  // シャッフル済みの山札を要求する
  requestShuffledDeck(data) {
    this.send('shuffle');
  }

  // シャッフル済みの山札を取得したので配牌する
  receiveShuffledDeck(data) {
    console.log(JSON.stringify(data));
    this.dora = new PixiPai(data.dora.id);
    this.dora.setPosition(PD.CanvasWidth * 0.4, PD.CanvasHeightCenter);
    this.dora.faceUp();
    this.dora.show();

    this.PM.idx = -1;
    this.PM.oya = this.PM.players.findIndex(p => p.playerName === data.oya);
    console.log("oya:" + this.PM.oya);
    // ドラ設定
    this.PM.announceDora(this.dora);
    let first_pos = { x: PD.CanvasWidth * 0.6, y: PD.CanvasHeightCenter };
    for (let player of this.PM.players) {
      for (let c of data.hand[player.playerName]) {
        var p = new PixiPai(c.id);
        p.setPosition(first_pos.x, first_pos.y);
        p.show();
        // 少しずつずらしながら配布
        player.draw(p, player.hand.length * 5);
      }
    }

    this.queueEvent({ "event": "showHands" });
    this.queueEvent({ "event": "sort" });
    this.queueEvent({ "event": "reportReady" });
  }

  // 理牌
  sort(data) {
    this.PM.sort();
  }
  showHands(data) {
    this.PM.me().open();
  }

  // 手順完了報告
  reportReady(data) {
    this.send('ready2Draw');
  }

  // 自摸
  draw(data) {
    this.PM.step();
    var card = new PixiPai(data.card.id);
    let first_pos = { x: PD.CanvasWidth * 0.6, y: PD.CanvasHeightCenter };
    card.setPosition(first_pos.x, first_pos.y);
    card.show();

    this.PM.current().draw(card);
    if (this.PM.isMyTurn()) { // 自局の場合描画完了後に行動選択する
      this.queueEvent({ "event": "start2Select" });
    }
  }

  // 手牌選択用の入力を有効にする
  start2Select(data) {
    this.PM.current().start2Select(this.watch2SelectAction.bind(this));
  }

  // 行動選択内容を監視し、決定したらサーバに結果を報告する
  watch2SelectAction(data) {
    this.send('action', data);
  }


  // 捨て牌
  waste(data) {
    this.PM.current().waste(data.id);
    if (this.PM.isMyTurn()) { // 自局の場合描画完了後に行動選択する
      this.send('reaction', 'pass');
    } else {
      // 捨て牌に寄る反応選択をする
      this.send('reaction', 'pass');
    }
  }

  hit(data) {
    console.log("ロン" + JSON.stringify(data));

    this.dialog = new PixiDialogOK("ロン", this.doNextGame.bind(this));
    this.dialog.show();
  }


  // 流局時
  endTable(data) {
    console.log("流局");
    this.dialog = new PixiDialogOK("流局", this.doNextGame.bind(this));
    this.dialog.show();
  }

  doNextGame() {
    this.dora.hide();
    for (let p of this.PM.players) {
      p.reset();
    }

    this.PM.nextGame();
    this.queueEvent({ "event": "requestShuffledDeck" });
  }
}
