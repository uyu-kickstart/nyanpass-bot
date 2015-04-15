// Description:
//   にゃんぱすー(๑¯Δ¯๑)
// Commands:
//   nyanpass, にゃんぱす... - にゃんぱすー(๑¯Δ¯๑)

const
NYANPASS_URL = 'http://nyanpass.com/count';

var
util      = require('util'),
useragent = require('random-useragent'),
request   = require('superagent');

module.exports = function (robot) {
  robot.hear(/(nyanpass|(にゃんぱす|ニャンパス)ー?)/i, function (msg) {
    var
    count = ~~(Math.random() * 1000) + 1;

    request
      .post(NYANPASS_URL + count)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ck: 1})
      .set('User-Agent', useragent.getRandom())
      .end(function (err, res) {
        if (err || !res.ok) return msg.send(err && util.inspect(err) || 'なにかがおかしいのん');
        msg.send('@' + msg.message.user.name + ': にゃんぱすー(๑¯Δ¯๑)\n' + res.text + '\nhttps://raw.githubusercontent.com/MakeNowJust/nyanpass-cli/master/nyanpass.jpg');
      });
  });
};
