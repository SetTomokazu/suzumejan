var PD = null;
var isPage2 = false;
var SJ = null;

document.addEventListener('show', function (event) {
  var page = event.target;
  if (page.id == 'ddd') {
    page.querySelector('#push-button').onclick = function () {
      document.querySelector('#navigator').pushPage('page2.html');
    };
  } else if (page.id == 'playfield') {
    page.querySelector('#pop-button').onclick = function () {
      document.querySelector('#navigator').popPage();
    };
    init();
  }
});
document.addEventListener('hide', function (event) {
  var page = event.target;
  if (page.id == 'page1') {
  } else if (page.id == 'page2') {
    console.log("hide");
    isPage2 = false;
  }
});

document.addEventListener('destroy', function (event) {
  var page = event.target;
  if (page.id == 'page1') {
  } else if (page.id == 'page2') {
    console.log("destroy");
  }
});

var init = () => {
  PD = new PixiDirector();
  SJ = new Suzumejan();
  //socket.emit('training', { roomId: user.roomId, name: user.name, event: 'biginDealing' });

  isPage2 = true;
  requestAnimFrame(update);
  PD.draw();
}


var vote = 0;
var finisher = [];
//捨牌
var waste = null;
let dialog = null;

var update = (time) => {
  if (isPage2 == false) return;
  SJ.update();
  PD.update(time);
  requestAnimFrame(update);
  PD.draw();
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