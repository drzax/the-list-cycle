module.exports = correspondents;

const client = require("./client");
const pager = require("./pager").pager;
const moment = require("moment");

function correspondents(duration) {
  return new Promise((resolve, reject) => {
    var earlier, users, timeline, favourites;

    users = [];
    duration = duration ? duration.split("-") : [];
    earlier = moment().subtract(+duration[0] || 1, duration[1] || "weeks");

    timeline = pager(
      client,
      "statuses/user_timeline",
      { count: 200 },
      stopAt(earlier)
    )
      .then(filterByTime(earlier))
      .then(filterTimeline)
      .then(compile);

    favourites = pager(
      client,
      "favorites/list",
      { count: 200 },
      stopAt(earlier)
    )
      .then(filterByTime(earlier))
      .then(compile);

    Promise.all([timeline, favourites]).then(
      ([timeline, favourites]) => {
        resolve(unique(timeline.concat(favourites)));
      },
      err => reject(err)
    );
  });
}

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

function filterByTime(time) {
  return statuses => {
    return statuses.filter(
      status => moment(status.created_at, "ddd MMM DD HH:mm:ss ZZ YYYY") >= time
    );
  };
}

function stopAt(time) {
  return res => {
    return (
      moment(res[res.length - 1].created_at, "ddd MMM DD HH:mm:ss ZZ YYYY") <
      time
    );
  };
}
