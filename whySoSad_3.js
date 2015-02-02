var Twit = require('twit')
var fs = require('fs');
var T = new Twit({
    consumer_key:         'vYz8TrCtGvAPRYZ20tHO8NHio'
  , consumer_secret:      '7GFDR4MTNbYza9dbWfgKi3O7KEgLGVYojoa852SEkZZpqjXjTq'
  , access_token:         '2989837761-HvgQxbXSrBVgxgyBI1YYzjwU7AaJ3U2xFPGQlIM'
  , access_token_secret:  'TZSi4HDBdOGBtslAmHLoPDNSMHtiHsmgi5tvcY2EA0E6G'
});
tweet_count = 0;

var sad_stream = T.stream('statuses/filter', { track: ':(', language: 'en' });

sad_stream.on('tweet', function (tweet) {

	if (tweet_count < 1){
		var tweet_handle = tweet.user.screen_name;

		console.log("Sad Panda: " + tweet_handle + "\n" + "Tweet Text: " + tweet.text);
		tweet_count++;
	}
	else{
		sad_stream.stop();
		console.log("sad_stream closed");
	}


});
// console.log(tweet_count+"\n");
// sad_stream.stop();
// console.log("sad_stream closed");