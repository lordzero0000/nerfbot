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
    token = process.env.GITHUB_ACCESS_TOKEN,
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
    },
    getAllIssues = (status, user, repo) => {
      var promise = new Promise((resolve, reject) => {
        github.authenticate({ type: "token", token: token });
        var opts = {
          user: user,
          repo: repo,
          state: status
        };
        github.issues.repoIssues(opts, (err, res) => {
          if (err) { return reject(err); }
          var list = res.map((item) => { return "#" + item.number + ": " + item.title; });
          return resolve(list);
        });
      });
      return promise;
    },
    changeIssueState = (state, number, user, repo) => {
      var promise = new Promise((resolve, reject) => {
        var opts = {
          user: user,
          repo: repo,
          number: number,
          state: state
        };
        github.issues.edit(opts, (err, res) => {
          if (err) { return reject(err); }
          return resolve(res);
        });
      });
      return promise;
    };

module.exports = (robot) => {
  robot.respond(/what's hot on github/i, (msg) => {
    getHotRepos()
    .then((repos) => {
      return msg.send("The most popular repositories are:\n " + (repos.join("\n")));
    }).catch((err) => {
      return msg.send("ERROR: " + err);
    });
  });
  robot.respond(/get (open|closed|all) issues of (.*)\/(.*)/i, (msg) => {
    var status = msg.match[1],
        username = msg.match[2],
        repo = msg.match[3];
    getAllIssues(status, username, repo)
    .then((issues) => {
      if (issues.length === 0) {
        return msg.send("No issues for " + username + "/" + repo);
      } else {
        return msg.send("All the " + status + " issues are:\n " + (issues.join("\n")));
      }
    }).catch((err) => {
      return msg.send("ERROR: " + err.message);
    });
  });
  robot.respond(/(open|close) issue #(.*) of (.*)\/(.*)/i, (msg) => {
    var state = (msg.match[1] === 'close') ? msg.match[1] + "d" : msg.match[1],
        number = msg.match[2],
        user = msg.match[3],
        repo = msg.match[4];
    changeIssueState(state, number, user, repo)
    .then((res) => {
      return msg.send("Issue #" + res.number + ": " + res.title + " is now " + res.state);
    }).catch((err) => {
      return msg.send("ERROR: " + err.message);
    });
  });
};
