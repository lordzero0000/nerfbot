// Description:
//   This bot will help you to control github for you...
//
// Commands:
//   remind me every <hour|minute> to <message>
//
// Notes:
// This may work... but everyone in the chat will tweet shit for you account... be careful...
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

var Cron = require('croner'), task,
    scheduleTask = (time, message, msg) => {
      if (time === 'hour') {
        time = '0 0 * * * *';
      } else if (time === 'minute') {
        time = '0 * * * * *';
      }
      task = Cron(time, () => { msg.send("Reminder: " + message); });
    },
    pauseTask = () => { task.pause(); },
    resumeTask = () => { task.resume(); },
    stopTask = () => { task.stop(); };

module.exports = (robot) => {
  robot.respond(/remind me every (.*) to (.*)/i, (msg) => {
    var time = msg.match[1], message = msg.match[2];
    scheduleTask(time, message, msg);
    msg.reply("Sure, I'll remind you that.");
  });
  robot.respond(/please forget what i said/i, (msg) => {
    stopTask();
    msg.reply("Ok, no problem.");
  });
};
