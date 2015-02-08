var Twit = require('twit')
var fs = require('fs');
var async = require('async');
var T = new Twit({
    consumer_key:         'vYz8TrCtGvAPRYZ20tHO8NHio'
  , consumer_secret:      '7GFDR4MTNbYza9dbWfgKi3O7KEgLGVYojoa852SEkZZpqjXjTq'
  , access_token:         '2989837761-HvgQxbXSrBVgxgyBI1YYzjwU7AaJ3U2xFPGQlIM'
  , access_token_secret:  'TZSi4HDBdOGBtslAmHLoPDNSMHtiHsmgi5tvcY2EA0E6G'
});
var Flickr = require('flickr').Flickr;
var client = new Flickr('ae6667eb03bf378f6a47dfd80d02352d', '733a34feb0798834', 
                        {"oauth_token": 'optional oauth token', "oauth_token_secret": 'optional oauth token secret'});
var tweetz = 0;
var prev_sadness = [];
var message = '';
var prev_message = 0;

function newMessage (prev_message) {
	var message_num = Math.floor((Math.random() * 10) + 1);
	if (message_num != prev_message) {
		switch(message_num) {
    		case 1:
        		message = "Feeling down? Here's a kitten. ";
        		prev_message = 1;
        		break;
    		case 2:
        		message = "If you having girl problems, I feel bad for you son...Here's a kitten. ";
		        prev_message = 2;
		        break;
		    case 3:
		        message = "Wah wah, boo hoo? KITTEN! ";
		        prev_message = 3;
		        break;
		    case 4:
		        message = "We all have bad days.  Here's a little ball of fuzz to turn yours around. ";
		        prev_message = 4;
		        break;
		    case 5:
		        message = "Need a smile?  Look at this for a while. ";
		        prev_message = 5;
		        break;
		    case 6:
		        message = "Being sad is fine, but don't stay that way.  Kitten up. ";
		        prev_message = 6;
		        break;
		    case 7:
		        message = "I know what makes me feel better when I'm down.  Allow me to share. ";
		        prev_message = 7;
		        break;
		    case 8:
		        message = "Boo Hoo!  I'm sad...Kitten! ";
		        prev_message = 8;
		        break;
		    case 9:
		        message = "Here's a little furry magic to help you through your bad day. ";
		        prev_message = 9;
		        break;
		    case 10:
		        message = "It could always be worse.  At least you have this to cheer you up. ";
		        prev_message = 10;
		        break;   
		    default:
		        "Having a bad day?  Here's a kitten to cheer you up! ";
		}
	} else {
		console.log("Duplicate message selected!\n");
		message_num = Math.floor((Math.random() * 10) + 1);
	}
	return message;
}
var post_good_feelz = function(message,screen_name,imageURL){
	var cheer_up = "@" + screen_name + " " + message + imageURL; 
	T.post("statuses/update", { status: cheer_up }, function(err, data, response) {
		console.log("Yes!  We brightened " + screen_name + "'s day!");
	})
	//console.log("Here's the feelz! " + cheer_up + "\n");
}
// This function translates a numerical photo ID into a unique base 58 id used in Flickr's url shortening service.
// Taken from https://www.flickr.com/groups/51035612836@N01/discuss/72157616713786392/72157620673064673
function translateToBase58 (num){
    if(typeof num!=='number')
		num=parseInt(num);
    //base 58 only has these characters:
    var enc='', alpha='123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'; 
    var div=num,mod;
    // Divide by 58 until we get to 58.
    while(num>=58){
	div=num/58; // Divide the number for each digit in base 58
	mod=num-(58*Math.floor(div)); // select the (base 58) number's alpha-numerical representation
	enc=''+alpha.substr(mod,1) +enc; // Use substr to get the char from the list
	num=Math.floor(div); // We don't care about fractions, so apply floor just in case.
    } 
    // return either the empty string or the encoded string.
    return(div)?''+alpha.substr(div,1)+enc:enc;
}
function getFlickrURL(search_term) {
	var flickr_params = {
		text: search_term,
		media: "photos",
		license: "1,2,3,4",
		safe_search:1,
		per_page: 25,
		page: 1,
		extras: "url_q, url_z, url_b, owner_name"
	};
	 client.executeAPIRequest("flickr.photos.search", flickr_params, false, function(err, result) {
		// Show the error if we got one
		if(err) {
			console.log("FLICKR ERROR: " + err);
			return;
		}
		else console.log("Success!");
		var photo1 = result.photos.photo[0];
		//var http = require('http-request');
		var imageURL = "http://flic.kr/p/"+translateToBase58(photo1.id);
		console.log(imageURL);
		// T.post('statuses/update', { status: message + imageURL}, function(err, data, response) {
		// 	if(err)
		// 		console.log("err: " + err);
		// 	else
		// 		console.log("Posted: " + data);
		//  });
	});
}
/*--------------------
	Start Stream!
--------------------*/
var sad_stream = T.stream('statuses/filter', { track: ':(', language: 'en' });
sad_stream.on('tweet', function (tweet) {
	linkz = tweet.text.indexOf("http"),
	mentionz = tweet.text.indexOf("@"),
	rtz = tweet.text.indexOf("RT");
	if(linkz == -1 && mentionz == -1 && rtz == -1){
		if (tweetz < 1){
			var screen_name = tweet.user.screen_name;
			var tweet_id = tweet.id_str;
			console.log("Sad Panda: " + screen_name + "\n" + "Tweet ID: " + tweet_id + "\n" + "Tweet Text: " + tweet.text);
			tweetz++;
			var already_happy = function(){
				prev_sadness.forEach(function(index){
					if(prev_sadness[index] == tweet_id){
						return true;
						console.log('Previous target');
					}
				});
			}
			if (already_happy != true) {
				sad_stream.stop();
				/*-----------------------
						Retweet!
				-----------------------*/
			  //   T.post('statuses/retweet/:id', { id: tweet_id }, 
			  //   	function(err, data, res){
					//     if(err){
					//     	console.error(err);
					//     	sad_stream.start();
					//     	var rt_error = '1';
					//     } else {
					//     	console.log("Retweeted " + screen_name + "'s" + " sadness.");
					//     }
					// });
				console.log("Retweeted " + screen_name + "'s" + " sadness.");
				prev_sadness.push(tweet_id);
				console.log(prev_sadness);
				/*---------------------
						Post New!
				---------------------*/
				
				async.series([
    				function(callback){
        				newMessage(prev_message); 
        				callback(null, message);
    				},
    				function(callback){
        				getFlickrURL("kitten"); 
        				callback(null, imageURL);
    				}
    				function(callback){
        				post_good_feelz(message,screen_name,imageURL); 
        				callback(null, cheer_up);
    				}
				],
				// optional callback 
				function(err, results){
    				// results is now equal to ['one', 'two'] 
				});


			} else {
				console.log("We already retweeted " + screen_name + "'s" + " sadness. No Post Made.");
			}
		}
		else{
			sad_stream.stop();
			console.log("sad_stream closed");
		}
	}
});