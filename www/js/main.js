// This is a JavaScript file

var socket = io('https://suzumejan-server.herokuapp.com');
var account = new Account();
var login = new LoginDialog();
var PD = null;
var SJ = null;
var logo = null;
var stack = new ViewStack();

ons.ready(function () {
  console.log("Onsen UI is ready!");
  account.load();
  PD = new PixiDirector();
  PD.start();
  stack.push(new Top());
});
