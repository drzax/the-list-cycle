module.exports = members;

const client = require("./client");
const pager = require("./pager").pager;

function members(list, user) {
  return new Promise((resolve, reject) => {
    var users, members;

    users = [];

    members = pager(client, "lists/members", {
      count: 5000,
      slug: list,
      owner_screen_name: user || process.env.TWITTER_SCREEN_NAME
    });

    members.then(members => {
      resolve(members.map(member => member.screen_name));
    });
  });
}
