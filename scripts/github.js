// Description:
//   This bot will help you to control github for you...
// Commands:
//   what's hot on github: This will show the hotest repos on github
//
// Notes:
// This may work... but everyone in the chat will tweet shit for you account... be careful...
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

var GitHubApi = require("github"),
    github = new GitHubApi({
      version: '3.0.0',
      debug: true,
      protocol: 'https',
      host: process.env.GITHUB_URL,
      pathPrefix: process.env.GITHUB_PREFIX,
      timeout: 5000,
      headers: {
        'user-agent': 'My-Cool-GitHub-App'
      }
    }),
    getHotRepos = () => {
      var promise = new Promise((resolve, reject) => {
        var opts = {
          q: 'stars:>1',
          sort: 'stars',
          order: 'desc',
          page: '1',
          per_page: '10'
        };
        github.search.repos(opts, (err, res) => {
          if (err) { return reject(err); }
          var list = res.items.map((item) => { return "- " + item.full_name; });
          return resolve(list);
        });
      });
      return promise;
    };

module.exports = function(robot) {
  robot.respond(/what's hot on github/i, function(msg) {
    getHotRepos()
    .then((repos) => {
      return msg.send("The most popular repositories are:\n " + (repos.join("\n")));
    }).catch((err) => {
      return msg.send("ERROR: " + err);
    });
  });
};
