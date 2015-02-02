var Twit = require('twit')
var fs = require('fs');
var T = new Twit({
    consumer_key:         'vYz8TrCtGvAPRYZ20tHO8NHio'
  , consumer_secret:      '7GFDR4MTNbYza9dbWfgKi3O7KEgLGVYojoa852SEkZZpqjXjTq'
  , access_token:         '2989837761-HvgQxbXSrBVgxgyBI1YYzjwU7AaJ3U2xFPGQlIM'
  , access_token_secret:  'TZSi4HDBdOGBtslAmHLoPDNSMHtiHsmgi5tvcY2EA0E6G'
});
var tweet_count = 0;
var prev_sadness = [];

var sad_stream = T.stream('statuses/filter', { track: ':(', language: 'en' });

sad_stream.on('tweet', function (tweet) {

	has_link = tweet.text.indexOf("http"),
	has_mention = tweet.text.indexOf("@"),
	has_rt = tweet.text.indexOf("RT");

	if(has_link == -1 && has_rt == -1 && has_mention == -1){

		if (tweet_count < 1){
			var tweet_handle = tweet.user.screen_name;
			var tweet_id_str = tweet.id_str;

			console.log("Sad Panda: " + tweet_handle + "\n" + "Tweet ID: " + tweet_id_str + "\n" + "Tweet Text: " + tweet.text);
			tweet_count++;

			var has_run = function(){
				prev_sadness.forEach(function(index){
					if(prev_sadness[index] == tweet_id){
						return true;
						console.log('Previous target');
					}
				});
			}

			if (has_run != true) {

				sad_stream.stop();

			    T.post('statuses/retweet/:id', { id: tweet_id_str }, 
			    	function(err, data, res){

					    if(err){
					    	console.error(err);
					    	sad_stream.start();

					    	var rt_error = '1';

					    } else {
					    	console.log("Retweeted " + tweet_handle + "'s" + " sadness.");
					    }

					});

				prev_sadness.push(tweet_id);

			} else {

				console.log("We already retweeted " + tweet_handle + "'s" + " sadness. No Post Made.");

			}

		}
		else{
			sad_stream.stop();
			console.log("sad_stream closed");
		}
		
	}

});
// console.log(tweet_count+"\n");
// sad_stream.stop();
// console.log("sad_stream closed");