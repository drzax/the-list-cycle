The List Cycle
==============

A little process which cycles Twitter users on and off a list based on interactions recency of interaction.

The idea is that it will use one of your Twitter lists (by default, one called `cycle`) to keep a list of all the people you've interacted with recently (by default, the last month).

The script considers someone you've 'interacted with' as being:

-	Anyone who you reply to, mention, retweet or subtweet.
-	Anyone who is mentioned in, or author of a tweet you favourite, retweet or subtweet.

Usage
-----

You will need a few Twitter credentials. The easiest way to get them is to install [twitter-list-manager](https://github.com/drzax/twitter-list-manager) as a global NPM module and run `tw auth`.

You'll also need to setup a list on Twitter for the use of the script. To make things easy, I suggest you call it `cycle`.

Then:

`node index.js`

Dockerized
----------

This thing has been Dockerized for convenient periodic updates in the cloud.

```
docker run -d --name cycle \
	-e TWITTER_OAUTH_CONSUMER_KEY=<seekrit> \
	-e  TWITTER_OAUTH_CONSUMER_SECRET=<seekrit> \
	-e TWITTER_USER_ID=<userid> \
	-e TWITTER_SCREEN_NAME=<username> \
	-e TWITTER_OAUTH_ACCESS_TOKEN_KEY=<seekrit> \
	-e TWITTER_OAUTH_ACCESS_TOKEN_SECRET=<seekrit> \
	drzax/list-cycle mantra "0 * * * * *" node index.js
```

The container will send errors to STDERR and messages about who has been added or removed from the list to STDOUT. I like to collect them for posterity and do that using [loggly](https://loggly.com) and [logspout](https://github.com/gliderlabs/logspout).

```
docker run --name logspout -d --volume=/var/run/docker.sock:/var/run/docker.sock -e SYSLOG_STRUCTURED_DATA="<apikey>@41058 tag=\"cycle\"" gliderlabs/logspout syslog+tcp://logs-01.loggly.com:514
```
