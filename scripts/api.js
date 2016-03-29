// Description:
//   This bot will help you to control github for you...
//
// Notes:
// This may work... but everyone in the chat will tweet shit for you account... be careful...
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

module.exports = (robot) => {
  robot.router.post('/api/trigger/:room', (req, res) => {
    var payload = req.body,
        room = req.params.room;
    console.log(payload, room);
    robot.messageRoom(room, "testing this shit")
    return res.send('Ok');
  });
};
