//using npm sentiment library
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

const router = require("express").Router();

const RedditDataModel = require("../models/redditData");
const FacebookDataModel = require("../models/facebookData");

router.get("/analyse", async (req, res) => {
    console.log(req.cookie);

    // TO DO: get user id from req
    // assume request contains userID
    let uid ="5deee516f0307e3a6011909e";

    if (!uid) {
        res.sendStatus(404);
    }

    let redditData;
    try {
        redditData = await RedditDataModel.findOne({userID:uid});
    } catch (error) {
        console.log("error getting reddit data");
        console.log("error");
    }
    let allPosts = "";
    if (redditData) {
        for (let foo of [redditData.comments, redditData.submissions, redditData.upvoted, redditData.downvoted]) {
            for (let item of foo) {
                allPosts.concat(item.text);
            }
        }
    }

    let fbData;
    try {
        fbData = await FacebookDataModel.findOne({userID:uid});
    } catch(error) {
        console.log("error getting facebook data");
        console.log(error);
    }
    if (fbData) {
        for (let post of fbData.posts) {
            allPosts.concat(post.message);
        }
    }

    var result = sentiment.analyze(allPosts);
    
    res.status(200).json(result);
});

module.exports = router;


