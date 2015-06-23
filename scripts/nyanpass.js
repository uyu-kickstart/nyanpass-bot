// Description:
//   にゃんぱすー(๑¯Δ¯๑)
// Commands:
//   nyanpass, にゃんぱす... - にゃんぱすー(๑¯Δ¯๑)

const
NYANPASS_URL_BASE = 'http://nyanpass.com/',
NYANPASS_URL_ADD = NYANPASS_URL_BASE + 'add.php',
NYANPASS_URL_GET = NYANPASS_URL_BASE + 'get?',
API = {
  add: function add() {
    return NYANPASS_URL_ADD;
  },
  get: function get() {
    return NYANPASS_URL_GET + '?' + Math.random();
  },
};


var
bloem     = require('bloem.js'),
util      = require('util'),
useragent = require('random-useragent'),
request   = require('superagent');

var
flow = bloem.Pomp()
  .connect(setup())
  .connect(api('add'))
  .connect(api('get'))
  .connect(send())
  .connect(error());

module.exports = function (robot) {
  robot.hear(/((?:[^@]|^)nyanpass|(にゃんぱす|ニャンパス)ー?)/i, function (msg) {
    flow.send(msg);
  });
};

function setup() {
  return bloem.map(function setupIter(msg) {
    return {
      msg: msg,
    };
  });
}

function api(name) {
  return bloem.map(function apiIter(state, next) {
    request.post(API[name]())
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({nyan: 'pass'})
      .set('User-Agent', useragent.getRandom())
      .end(function apiRequestCallback(err, res) {
        if (err) return next(err);
        state[name] = res.body;
        next(null, state);
      });
  });
}

function send() {
  return bloem.map(function sendIter(state) {
    var
    msg = state.msg;
    msg.send('@' + msg.message.user.name + ': にゃんぱすー(๑¯Δ¯๑)\n' + state.get.cnt + '\nhttps://raw.githubusercontent.com/MakeNowJust/nyanpass-cli/master/nyanpass.jpg');
  });
}

function error() {
  return bloem.rescue(function errorIter(err) {
    console.log(util.inspect(err));
    state.msg.send('なにかがおかしいのん:\n' + err.message);
  });
}
