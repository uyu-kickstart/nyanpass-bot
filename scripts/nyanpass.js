// Description:
//   にゃんぱすー(๑¯Δ¯๑)
// Commands:
//   nyanpass, にゃんぱす... - にゃんぱすー(๑¯Δ¯๑)

const
NYANPASS_URL = 'http://nyanpass.com/count';

var
useragent = require('random-useragent'),
request   = require('superagent');

module.exports = function (robot) {
  robot.hear(/^\s*(nyanpass|(にゃんぱす|ニャンパス)ー?)\s*$/i, function (msg) {
    var
    count = ~~(Math.random() * 1000) + 1;

    request
      .post(NYANPASS_URL + count)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ck: 1})
      .set('User-Agent', useragent.getRandom())
      .end(function (err, res) {
        if (err || !res.ok) return msg.send(err || 'なにかがおかしいのん');
        msg.reply('にゃんぱすー(๑¯Δ¯๑)\n' + res.text + '\nhttps://raw.githubusercontent.com/MakeNowJust/nyanpass-cli/master/nyanpass.jpg');
      });
  });
};
