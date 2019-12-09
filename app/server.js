const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
const RedditDataModel = require("./models/redditData");
const FacebookDataModel = require("./models/facebookData");

const mongoose = require("mongoose");
const redditScraper = require("./scrapers/redditScraper");
const facebookScraper = require("./scrapers/facebookScraper");
//
const jwt = require("jwt-simple");

const SECRET = process.env.SECRET;

//

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


function getUser(cookie) {
    return new Promise((resolve, reject) => {
        if (!cookie) {
            resolve(null);
        }

        const token = cookie;
        try {
            const decoded = jwt.decode(token, SECRET);
            decodedUsername = decoded.username;
            User.findOne({ username: decodedUsername }, (err, user) => {
                if (err) reject(err);

                if (!user) {
                    reject();
                } else {
                    resolve(user);
                }
            });
        } catch (ex) {
            reject(ex);
        }
    });
}


router.get("/scrape", async(req, res) => {
    console.log(`Received a request to analyze a user's data with the query values ${Object.entries(req.query).map((pair) => pair.join(": ")).join(", ")}`);
    
    
    const scrapedData = {};
    if (req.query.redditCode) {
        scrapedData.reddit = await redditScraper.scrapeUser(req.query.redditCode);
    }
    if (req.query.facebookCode) {
        scrapedData.facebook = await facebookScraper.scrapeUser(req.query.facebookCode);
    }

    //TODO get logged in user id
    // const userID = "42";
    //let token = window.localStorage.getItem("token");
    //'x-auth=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3Ryb2JlcnQifQ.ILGdmHYwNoen9CwS1KIR9aDS_nNNNUr8EITUM9Flges'
    let user = await getUser(req.headers.cookie.substring(7));
    if(!user){
        console.log("failed to find user");
        res.status(500).send("failed to find user");
    }
    const userID = user._id;
    // create a new document for reddit data
    if(scrapedData.reddit){
        let scrapedRedditData = scrapedData.reddit;
        scrapedRedditData.userID = userID;
        let reddit_document = new RedditDataModel(scrapedRedditData);
        try {
            await reddit_document.save()
        } catch (error){
            console.log("failed to save reddit data");
            console.log(error);
        }
    }
    if (scrapedData.facebook){
        // create document for facebook data
        let scrapedFacebookData = scrapedData.facebook;
        scrapedFacebookData.userID = userID;
        let facebook_document = new FacebookDataModel(scrapedFacebookData);
        try {
            await facebook_document.save();
        } catch(error) {
            console.log("failed to save facebook data");
            console.log("error");
        }
    }
    // send success status?
    // res.redirect("/analyse");
    res.redirect(`/analyse?userID=${userID}`);

});





app.use(router);



//serve static files from public dir
app.use(express.static("public", { index: false, extensions: ["html"] }));
app.listen(3000);