module.exports = remove;

const client = require("./client");

function remove(list, accounts) {
  return new Promise((resolve, reject) => {
    client.post(
      "lists/members/destroy_all",
      {
        slug: list,
        owner_id: process.env.TWITTER_USER_ID,
        screen_name: accounts.join(",")
      },
      function(err, res) {
        if (err) {
          reject(err);
        }
        resolve({
          list: list,
          accounts: accounts
        });
      }
    );
  });
}
