# The List Cycle

A little process which cycles Twitter users on and off a list based on interactions recency of interaction.

The idea is that it will use one of your Twitter lists (by default, one called `cycle`) to keep a list of all the people you've interacted with recently (by default, the last month).

The script considers someone you've 'interacted with' as being:

- Anyone who you reply to, mention, retweet or subtweet.
- Anyone who is mentioned in, or author of a tweet you favourite, retweet or subtweet.

## Deployment

`npm install`

### Define the following environment variables.

```
 TWITTER_OAUTH_CONSUMER_KEY=<seekrit>
 TWITTER_OAUTH_CONSUMER_SECRET=<seekrit>
 TWITTER_USER_ID=<userid>
 TWITTER_SCREEN_NAME=<username>
 TWITTER_OAUTH_ACCESS_TOKEN_KEY=<seekrit>
 TWITTER_OAUTH_ACCESS_TOKEN_SECRET=<seekrit>
 TWITTER_WINDOW="1-month" # optional
 TWITTER_LIST=cycle # optional
```

One way to get these twitter API tokens is is to install [twitter-list-manager](https://github.com/drzax/twitter-list-manager) as a global NPM module and run `tw auth`.

### Setup a twitter list

You'll also need to setup a list on Twitter for the use of the script. The expected default is 'cycle'.

### Setup a [Google Cloud Platform](https://cloud.google.com) project

- Setup project as per the [serverless documentation](https://serverless.com/framework/docs/providers/google/guide/credentials/)
- Setup a Pub/Sub topic called `list-cycle`
- Setup a Cloud Scheduler job to message the `list-cycle` pub/sub topic on your chose interval (every hour recommended)

### Finally

```
serverless deploy
```
