// Description:
//   HaLakeの情報が取れる
// Commands:
//   halake, nyampass - HaLakeの情報を取ってきて表示

const
API = {
  temperature: 'https://halake-api.herokuapp.com/1.0/temperature',
  humidity: 'https://halake-api.herokuapp.com/1.0/humidity',
  congestion: 'https://halake-api.herokuapp.com/1.0/congestion',
};

var
bloem   = require('bloem.js'),
util    = require('util'),
request = require('superagent');

var
flow = bloem.Pomp()
  .connect(setup())
  .connect(api('temperature'))
  .connect(api('humidity'))
  .connect(send())
  .connect(error());

module.exports = function (robot) {
  robot.respond(/(halake|nyampass)/i, function (msg) {
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
    request.get(API[name])
      .set('User-Agent', 'nyanpass-bot by @MakeNowJust')
      .end(function apiRequestCallback(err, res) {
        if (err) return next(err);
        state[name] = res.body;
        next(null, state);
      });
  });
}

function send() {
  return bloem.map(function sendIter(state) {
    state.msg.send(['@' + state.msg.message.user.name + ': ',
      'HaLakeの現在の温度は ' + state.temperature.temperature + '℃ 、湿度は ' + state.humidity.humidity + '% なのん(๑¯Δ¯๑)\n',
      '正直どうでもいいのん'
    ].join(''));
  });
}

function error() {
  return bloem.rescue(function errorIter(err) {
    state.msg.send(err && util.inspect(err) || 'なにかがおかしいのん');
  });
}
