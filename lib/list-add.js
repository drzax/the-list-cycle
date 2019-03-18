module.exports = add;

const client = require("./client");

function add(list, accounts) {
  return new Promise((resolve, reject) => {
    var length = accounts.length;
    var delay = 500;
    var params = {};

    // Work on a copy.
    accounts = accounts.slice();

    params.screen_name = accounts.splice(0, 100).join(",");

    if (isNumeric(list)) {
      params.list_id = list;
    } else {
      params.slug = list;
      params.owner_screen_name = process.env.TWITTER_SCREEN_NAME;
    }

    client.post("lists/members/create_all", params, handleResult);

    function handleResult(err, res) {
      if (err) {
        reject(err);
      }

      if (accounts.length) {
        delay = delay * 2;
        params.screen_name = accounts.splice(0, 100).join(",");
        setTimeout(
          () => client.post("lists/members/create_all", params, handleResult),
          delay
        );
      } else {
        resolve({
          count: length,
          list: list
        });
      }
    }
  });
}

function isNumeric(n) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}
