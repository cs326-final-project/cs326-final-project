
const RedditData = require("../models/redditData");
const router = require("express").Router();

router.post("/redditData", (req, res) => {
    let data = new RedditData({
        comments: req.body.comments,
        submissions: req.body.submissions,
        upvoted: req.body.upvoted,
        downvoted: req.body.downvoted,
        userID: req.body.userID
    });
    data.save((err)=> {
        if (err){
            res.status(500).json({ error: "Error creating user" });
        } else{
            res.sendStatus(201); // New document created successfully
        }
    })
});

module.exports = router;