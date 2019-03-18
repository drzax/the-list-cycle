var Twitter = require("twitter");

// Setup twitter client
var T = new Twitter({
  consumer_key: process.env.TWITTER_OAUTH_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_OAUTH_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_OAUTH_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_OAUTH_ACCESS_TOKEN_SECRET
});

T.me = {
  screen_name: process.env.TWITTER_SCREEN_NAME,
  user_id: process.env.TWITTER_USER_ID
};

module.exports = T;
