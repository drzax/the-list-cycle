const decrement = require("./decrement");

function pager(transport, endpoint, args, stop) {
  // If no stop function is supplied use one that returns false (never stop)
  stop =
    stop ||
    function() {
      return false;
    };

  return new Promise((resolve, reject) => {
    var response = [];

    transport.get(endpoint, args, handleResult);

    function handleResult(err, res) {
      var next, items;

      // Reject on any error
      if (err) return reject(err);

      next = getNext(res);
      items = getItems(res);

      // Add new items to the response
      response = response.concat(items);

      if (next === false || stop(res)) {
        resolve(response);
      } else {
        args[next.type] = next.value;
        transport.get(endpoint, args, handleResult);
      }
    }
  });
}

function getItems(res) {
  var key;

  if (Array.isArray(res)) {
    return res;
  }

  // This makes the possibly incorrect assumption that for API methods which
  // return a non-array result, there will be a single key on the object which
  // is the list of items we want returned (paged through).
  // This is the case for cursored methods, for example:
  // - lists/ownerships
  // - lists/members
  for (key in res) {
    if (Array.isArray(res[key])) {
      return res[key];
    }
  }
}

function getNext(res) {
  if (res.next_cursor_str) {
    if (res.next_cursor === 0) {
      return false;
    }
    return {
      type: "cursor",
      value: res.next_cursor_str
    };
  }

  return {
    type: "max_id",
    value: decrement(res[res.length - 1].id_str)
  };
}

// Pages through Twitter API calls until criteria met
module.exports = { pager, getItems, getNext };
