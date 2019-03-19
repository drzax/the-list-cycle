const client = require("./client");
const pager = require("./pager").pager;
const moment = require("moment");

function correspondents(durationStr) {
  return new Promise((resolve, reject) => {
    // Parse duration
    const duration = durationStr ? durationStr.split("-") : [];
    const earlier = moment().subtract(
      +duration[0] || 1,
      duration[1] || "weeks"
    );

    const stopFn = stopAt(earlier);
    const filterFn = filterByTime(earlier);

    const timeline = pager(
      client,
      "statuses/user_timeline",
      { count: 200 },
      stopFn
    )
      .then(filterFn)
      .then(filterTimeline)
      .then(compile);

    const favourites = pager(client, "favorites/list", { count: 200 }, stopFn)
      .then(filterFn)
      .then(compile);

    Promise.all([timeline, favourites]).then(
      ([timeline, favourites]) => {
        resolve(unique(timeline.concat(favourites)));
      },
      err => reject(err)
    );
  });
}

// Get a list of all usernames associated with a tweet.
function compile(statuses) {
  return statuses.reduce((t, r) => {
    t.push(r.user.screen_name);
    if (r.retweeted_status) t.push(r.retweeted_status.user.screen_name);
    if (r.quoted_status) t.push(r.quoted_status.user.screen_name);
    if (r.in_reply_to_screen_name) t.push(r.in_reply_to_screen_name);
    r.entities.user_mentions.forEach(mention => {
      t.push(mention.screen_name);
    });
    return t;
  }, []);
}

// Make sure array of strings has only unique values
function unique(arr) {
  return arr.reduce((t, i) => {
    if (t.indexOf(i) === -1) {
      t.push(i);
    }
    return t;
  }, []);
}

function filterTimeline(statuses) {
  return statuses.filter(r => {
    return (
      !!r.retweeted_status || !!r.quoted_status || r.in_reply_to_screen_name
    );
  });
}

// Return a function which will filter statuses based on timestamp.
function filterByTime(time) {
  return statuses => {
    return statuses.filter(
      status => moment(status.created_at, "ddd MMM DD HH:mm:ss ZZ YYYY") >= time
    );
  };
}

// Returns a function which returns a true or false when passed a twitter API response depending
// on whether the response is before or after the given date/time.
function stopAt(time) {
  return res => {
    return (
      moment(res[res.length - 1].created_at, "ddd MMM DD HH:mm:ss ZZ YYYY") <
      time
    );
  };
}

module.exports = {
  correspondents,
  compile,
  unique,
  filterTimeline,
  filterByTime,
  stopAt
};
