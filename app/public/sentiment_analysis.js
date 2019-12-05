var Sentiment = require('sentiment');
var sentiment = new Sentiment();

function postAnalysis(smPost) {
    smPost = "fuck shit fucker dick ass";
    var result = sentiment.analyze(smPost);
    console.log(result);
}