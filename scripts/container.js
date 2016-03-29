// Description:
//   Example scripts for you to examine and try out.
//
// Commands:
//   show images - Show the local images.
//   running containers - Show the running containers.
//   run <image_name> as <container_name>: Run the indicated images as the given name.
//   stop <container_name>: Stop the given container name.
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
  robot.respond(/show images/i, (res) => {
    executeCmd('docker images')
    .then((stdout) => {
      return res.send(stdout);
    }).catch((err) => {
      return res.send(err);
    });
  });
  robot.respond(/running containers/i, (res) => {
    executeCmd('docker ps')
    .then((stdout) => {
      return res.send(stdout);
    }).catch((err) => {
      return res.send(err);
    });
  });
  robot.respond(/stop (.*)/i, (res) => {
    var container = res.match[1];
    executeCmd('docker stop ' + container)
    .then((stdout) => {
      return res.send("The container " + stdout.trim() + " is now stopped.");
    }).catch((err) => {
      return res.send(err);
    });
  });
  robot.respond(/run (.*) as (.*)/i, (res) => {
    var image = res.match[1],
        name = res.match[2];
    executeCmd('docker run -d -p 80:80 --name ' + name + ' ' + image)
    .then((stdout) => {
      return res.send("Now running " + image + " as " + name + ".");
    }).catch((err) => {
      return res.send(err);
    });
  });
};
