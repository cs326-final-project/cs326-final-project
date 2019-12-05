const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
const RedditData = require("./models/redditData");

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

app.use(router);

app.get("/analyzeData", async(req, res) => {
    console.log(`Received a request to analyze a user's data with the query values ${Object.entries(req.query).map((pair) => pair.join(": ")).join(", ")}`);

    const scrapedData = {};
    if (req.query.redditCode) {
        scrapedData.reddit = await redditScraper.scrapeUser(req.query.redditCode);
    }
    if (req.query.facebookCode) {
        scrapedData.facebook = await facebookScraper.scrapeUser(req.query.facebookCode);
    }

    //TODO get logged in user id
    const userID = "42";
    // create appropriate documents for reddit / facebook data
    let RedditDataModel = mongoose.model('Reddit', RedditData);
    let scrapedRedditData = scrapedData.reddit;
    scrapedRedditData.userID = userID;
    let reddit_document = new RedditDataModel(scrapedData);
    reddit_document.save(err=> {
        if(err){
            console.log("can't save reddit data");
        }
    });
    // send success status?
    // res.status(200).send(scrapedData);
});

//serve static files from public dir
app.use(express.static("public", { index: false, extensions: ["html"] }));
app.listen(3000);
