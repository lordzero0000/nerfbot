// Description:
//   This bot will tweet shit for you.
// Commands:
//   get last <number> tweets: Prints the last _n_ tweets.
//   tweet this <your_tweet>: This will tweet any quote after command.
//   tweet shit: this will tweet a random quote...
//
// Notes:
// This may work... but everyone in the chat will tweet shit for you account... be careful...
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

var Twitter = require('twitter'),
    client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    }),
    quotes = [
      "JoJo's Bizarre Adventure: Phantom Blood",
      "JoJo's Bizarre Adventure: Battle Tendency",
      "JoJo's Bizarre Adventure: Stardust Crusaders",
      "JoJo's Bizarre Adventure: Diamond is Unbreakable",
      "JoJo's Bizarre Adventure: Vento Aureo",
      "JoJo's Bizarre Adventure: Stone Ocean",
      "JoJo's Bizarre Adventure: Steel Ball Run",
      "JoJo's Bizarre Adventure: JoJolion"
    ],
    postTweet = (tweet) => {
      var promise = new Promise((resolve, reject) => {
        var opts = { status: tweet };
        client.post('statuses/update', opts, (error, tweet, response) => {
          if(error) { return reject(error); };
          console.log(response.body);
          return resolve(response.body);
        });
      });
      return promise;
    },
    getTimeline = (count) => {
      var promise = new Promise((resolve, reject) => {
        var opts = { count: count };
        client.get('statuses/user_timeline', opts, (error, tweets, response) => {
          if(error) { return reject(error); };
          var list = tweets.map((tweet) => { return tweet.text; });
          return resolve(list);
        });
      });
      return promise;
    },
    getTweetUrl = (tweetInfo) => {
      return "https://twitter.com/" + tweetInfo.user.screen_name + "/status/" + tweetInfo.id;
    };

module.exports = (robot) => {
  robot.respond(/tweet this (.*)/i, (res) => {
    var tweet = res.match[1];
    postTweet(tweet)
    .then((tweetRes) => {
      return res.send("Tweeted!");
    }).catch((err) => {
      return res.send(err);
    })
  });
  robot.respond(/get last (.*) tweets/i, (res) => {
    var count = Number.isInteger(parseInt(res.match[1])) ? res.match[1] : 10;
    getTimeline(count)
    .then((tweets) => {
      return res.send("This are the last " + count + " tweets:\n" + (tweets.join("\n")));
    }).catch((err) => {
      return res.send(err);
    })
  });
  robot.respond(/tweet shit/i, (res) => {
    var tweet = quotes[Math.floor(Math.random() * quotes.length)];
    postTweet(tweet)
    .then((tweetRes) => {
      return res.send("Tweeted!");
    }).catch((err) => {
      return res.send(err);
    })
  });
};
