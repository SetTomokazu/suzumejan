// This is a JavaScript file

var socket = io('https://suzumejan-server.herokuapp.com');

var login = () => {
  let playerName = document.getElementById('username').value;
  console.log('Try login as ' + playerName);
  //ログイン結果取得時の処理
  socket.on('login', (data) => {
    console.log('login result ' + data);
    account.playerName = playerName;
    console.log(account.playerName);
    let content = document.getElementById('navigator');
    content.resetToPage('home.html', { animation: 'slide' });
  });
  socket.emit('login', playerName);
};

var training = () => {
  let content = document.getElementById('navigator');
  content.resetToPage('playfield.html', { animation: 'slide' });
}
