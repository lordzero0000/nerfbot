// Description:
//   Example scripts for you to examine and try out.
//
// Notes:
//   They are commented out by default, because most of them are pretty silly and
//   wouldn't be useful and amusing enough for day to day huboting.
//   Uncomment the ones you want to try and experiment with.
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

var exec = require('child_process').exec,
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
    };

module.exports = (robot) => {
  robot.respond(/open the (.*) door/i, (res) => {
    var doorType = res.match[1];
    return res.send("Opening " + doorType + " door");
  });
  robot.respond(/show images/i, (res) => {
    executeCmd('docker images')
    .then((stdout) => {
      return res.send(stdout);
    }).catch((err) => {
      return res.send(err);
    })
  });
  robot.respond(/running containers/i, (res) => {
    executeCmd('docker ps')
    .then((stdout) => {
      return res.send(stdout);
    }).catch((err) => {
      return res.send(err);
    })
  });
};
