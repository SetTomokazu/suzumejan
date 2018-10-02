//点数取得
const calc = (idx, hands) => {
  var cards = hands.concat();
  var result = {
    detail: [],
    score: 0
  }
  cards.sort((a, b) => a.data - b.data);
  //メンツができてなければ終わり
  if (isTempai(cards) == false) return result;
  //スーパーレッド判定
  if (cards.filter(x => Number(x.dora) == 1).length == 6) {
    result.score = 20;
    result.detail.push("スーパーレッド:20点");
    return result;
  }
  //オールグリーン判定
  if (cards.filter(x => Number(x.dora) == 0 && AllGrean.indexOf(Number(x.data)) > -1).length == 6) {
    result.score = 10;
    result.detail.push("オールグリーン:10点");
    return result;
  }
  //チンヤオ判定
  if (cards.filter(x => Number(x.data) == 1 || 9 <= Number(x.data)).length == 6) {
    result.detail.push("チンヤオ:15点");
    result.score = 15;
    return result;
  }

  //表示ドラ加算
  let dora = cards.filter(x => Number(x.data) === Number(deck.dora.data)).length;
  if (Number(dora) > 0) {
    result.score += Number(dora);
    result.detail.push("ドラ:" + Number(dora) + "点");
  }
  //赤ドラ加算
  let akadora = cards.filter(x => Number(x.dora) === 1).length;
  if (Number(akadora) > 0) {
    result.score += Number(akadora);
    result.detail.push("赤ドラ:" + Number(akadora) + "点");
  }

  let chanta_count = 0;
  for (let i = 1; i < 12; i++) {
    if (cards.filter(x => Number(x.data) == i).length >= 3) {
      result.score += 2;
      cards = spliceAt(cards, i);
      cards = spliceAt(cards, i);
      cards = spliceAt(cards, i);
      result.detail.unshift("刻子:2点");
      if (i == 1 || 9 <= i) {
        chanta_count++;
      }
    }
  }
  for (let i = 1; i <= 7; i++) {
    for (let x = 2; x >= 1; x--) {
      if (cards.filter(x => Number(x.data) == Number(i)).length >= x &&
        cards.filter(x => Number(x.data) == Number(i) + 1).length >= x &&
        cards.filter(x => Number(x.data) == Number(i) + 2).length >= x
      ) {
        result.score += x;
        result.detail.unshift("順子:1点");
        cards = spliceAt(cards, i);
        cards = spliceAt(cards, i + 1);
        cards = spliceAt(cards, i + 2);
        if (i == 1 || i == 7) {
          chanta_count += x;
        }
        break;
      }
    }
  }
  switch (chanta_count) {
    case 0://タンヤオ
      result.detail.push("タンヤオ:1点");
      result.score += 1;
      break;
    case 1:
      break;
    case 2://チャンタ
      result.detail.push("チャンタ:2点");
      result.score += 2;
      break;
    default:
      break;
  }
  if (idx == PM.currentIdx) {
    result.detail.push("親:2点");
    result.score += 2;
  }
  return result;
}

//メンツができてるかどうかだけのチェック
var isTempai = function (cards) {
  let score = 0;
  let used = cards.concat();
  for (let i = 1; i < 12; i++) {
    if (used.filter(x => Number(x.data) == i).length >= 3) {
      used = spliceAt(used, i);
      used = spliceAt(used, i);
      used = spliceAt(used, i);
      score += 2;
    }
  }
  for (let i = 1; i <= 7; i++) {
    if (used.filter(x => Number(x.data) == Number(i)).length >= 1 &&
      used.filter(x => Number(x.data) == Number(i + 1)).length >= 1 &&
      used.filter(x => Number(x.data) == Number(i + 2)).length >= 1
    ) {
      score += 1;
      for (let offset = 0; offset < 3; offset++) {
        used = spliceAt(used, i + offset);
      }
    }
    if (used.filter(x => Number(x.data) == Number(i)).length >= 1 &&
      used.filter(x => Number(x.data) == Number(i) + 1).length >= 1 &&
      used.filter(x => Number(x.data) == Number(i) + 2).length >= 1
    ) {
      score += 1;
      for (let offset = 0; offset < 3; offset++) {
        used = spliceAt(used, i + offset);
      }
    }
  }
  return used.length == 0;
}

const spliceAt = (ary, data) => {
  for (let i in ary) {
    if (Number(ary[i].data) === Number(data)) {
      ary.splice(i, 1);
      break;
    }
  }
  return ary;
}
