/* 

Emergency Kitten will search twitter for instances of #emergencyKitten.  
It will then look for the following format:

"I am so sad that the seahawks lost the super bowl #emergencyKitten"

or

"I am so sad about the loss of our best friend, Fido #emergencyKitten"

Will also look for "We are" vs "I am".

Then the information will be parsed into a tweet to the user who invoked Emergency Kitten.

ex: "@user_name, sorry you are sad about... http://bit.ly/link #kittenDeployed"

Spam filter will saerch for mentions(MTN), links(LNK) or retweets(RTS).

Flickr API will provide the link to the kitten img.

 */

//require twit and fs


//variable declaration


//search twitter for #emergencyKitten and skip spam tweets


//parse tweet into response text, pull user_name and tweet_id and store both.


//build flickr img url to inject into response.