const db = require("../db");


const RedditData = db.model("RedditData", {
    comments: { type: Array, required: false },
    submissions: {type: Array, required: false },
    upvoted: {type: Array, required: false },
    downvoted: {type: Array, required: false },
    userID: String
});


module.exports = RedditData;
