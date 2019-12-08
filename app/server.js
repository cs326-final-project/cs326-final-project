const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
const RedditDataModel = require("./models/redditData");
const FacebookDataModel = require("./models/facebookData");

const mongoose = require("mongoose");
const redditScraper = require("./scrapers/redditScraper");
const facebookScraper = require("./scrapers/facebookScraper");

//url param indicates machine mongodb is running on /nameOfDatabase
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost/mirrordb");

// a Model is a constructor compiled from a schema
// instance of model represent MongoDB documnets that can be saved or written
// two params modelName: name of model's collection, and schema: previously defined schema

const app = express();
const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use("/api", require("./api/users"));
router.use("/api", require("./api/redditdata"));
router.use("/api", require("./api/scrape"));
router.use("/api", require("./api/analyse"));


app.use(router);



//serve static files from public dir
app.use(express.static("public", { index: false, extensions: ["html"] }));
app.listen(3000);