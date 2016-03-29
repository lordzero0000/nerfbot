// Description:
//   This bot will help you to control github for you...
//
// Notes:
// This may work... but everyone in the chat will tweet shit for you account... be careful...
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

var cleverbot = require('cleverbot.io'),
    bot = new cleverbot(process.env.CLEVERBOT_API_USER, process.env.CLEVERBOT_API_KEY),
    sendMessage = (username, message) => {
      var promise = new Promise((resolve, reject) => {
        bot.setNick(username);
        bot.create((err, username) => {
          if (err) { return reject(err); }
          bot.ask(message, (err, response) => {
            if (err) { return reject(err); }
            return resolve(response)
          });
        });
      });
      return promise;
    };

module.exports = (robot) => {
  // robot.respond(/(.*)/i, (msg) => {
  //   sendMessage(msg.message.user.name, msg.message.rawText)
  //   .then((response) => {
  //     return msg.reply(response);
  //   })
  //   .catch((error) => {
  //     return msg.send("ERROR: " + error);
  //   });
  // });
};
