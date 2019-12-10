//using npm sentiment library
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

//TODO get post data from server
var smPost = "Shit diaper fart";
//data from server ran through sentiment analysis
var result = sentiment.analyze(smPost);
console.log(result);

