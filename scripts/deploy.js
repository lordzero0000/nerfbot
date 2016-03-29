// Description:
//   This bot will help you to control github for you...
//
// Notes:
// This may work... but everyone in the chat will tweet shit for you account... be careful...
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

var Cron = require('croner'),
    Twitter = require('twitter'),
    client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    }),
    exec = require('child_process').exec,
    executeCmd = (cmd) => {
      var promise = new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error !== null) {
            console.log('exec error: ' + error);
            return reject(error);
          }
          return resolve(stdout);
        });
      });
      return promise;
    },
    postTweet = (tweet) => {
      var promise = new Promise((resolve, reject) => {
        var opts = { status: tweet };
        client.post('statuses/update', opts, (error, tweet, response) => {
          if(error) { return reject(error); };
          return resolve(response.body);
        });
      });
      return promise;
    },
    getTweetUrl = (tweetInfo) => {
      var tweet = JSON.parse(tweetInfo);
      return "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
    };

module.exports = (robot) => {
  robot.respond(/deploy (.*) at (.*):(.*)/i, (msg) => {
    var image = msg.match[1],
        hour = msg.match[2],
        minute = msg.match[3],
        time = '0 ' + minute + ' ' + hour + ' * * *',
        task = Cron(time, () => {
          executeCmd('docker run -d -p 80:80 ' + image)
          .then((stdout) => {
            postTweet("Deployed " + image + " at " + hour + ":" + minute +  "! Be happy now!")
            .then((tweetRes) => {
              return msg.send("Tweeted! Check it at: " + getTweetUrl(tweetRes));
            }).catch((err) => {
              return msg.send(err);
            });
            return msg.send("Now running " + image + "on " + stdout.trim());
          }).catch((err) => {
            return msg.send("Could not deploy! " + err);
          });
        });
        return msg.reply("Got it! Scheduled deploy for " + image + " at " + hour + ":" + minute + "!");
  });
};
