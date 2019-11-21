const db = require("../db");

// Create model from schema
const User = db.model("User", {
    username: { type: String, required: true },
    password: { type: String, required: true },
    status: String
});

const RedditData = db.model("RedditData", {
    comments: { type: Array, required: false },
    submissions: {type: Array, required: false },
    upvoted: {type: Array, required: false },
    downvoted: {type: Array, required: false }
});


module.exports = RedditData;

const scrapedData = {
    comments: [],
    submissions: [],
    upvoted: [],
    downvoted: []
};