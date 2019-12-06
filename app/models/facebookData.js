const db = require("../db");


const FacebookData = db.model("Facebook Data", {
    posts: { type: Array, required: false },
    userID: String
});


module.exports = FacebookData;
