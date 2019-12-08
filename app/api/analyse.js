// User creation and authentication with password hashing.
// Code sourced from Zybooks 11.12 https://learn.zybooks.com/zybook/UMASSCOMPSCI326RichardsAcademicYear2020/chapter/11/section/12
const jwt = require("jwt-simple");
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt-nodejs");
const dotenv = require("dotenv").config({ path: __dirname + "/../private.env" });

const saltRounds = 10;
const SECRET = process.env.SECRET;


router.get("/analyse", async(req, res) => {
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
    let token = window.localStorage.getItem("token");
    //token is encoded username
    //decode to get username
    //lookup user (getUser?)
    //get user's scraped data

    // create a new document for reddit data
    let scrapedRedditData = scrapedData.reddit;
    scrapedRedditData.userID = userID;
    let reddit_document = new RedditDataModel(scrapedRedditData);
    try {
        await reddit_document.save()
    } catch (error){
        console.log("failed to save reddit data");
        console.log(error);
    }
    // create document for facebook data
    console.log(scrapedData);
    let scrapedFacebookData = scrapedData.facebook;
    scrapedFacebookData.userID = userID;
    let facebook_document = new FacebookDataModel(scrapedFacebookData);
    try {
        await facebook_document.save();
    } catch(error) {
        console.log("failed to save facebook data");
        console.log("error");
    }
    // send success status?
    res.sendStatus(201);
});

/*
router.post("/user", (req, res) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, null, (err, hash) => {
            let newUser = new User({
                username: req.body.username,
                password: hash,
                email: req.body.email,
            });

            newUser.save((err) => {
                if (err) {
                    res.status(500).json({ error: "Error creating user" });
                } else {
                    res.redirect("/login"); // New user created
                }
            });
        });
    });
});

router.post("/auth", (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.status(401).json({ error: "Invalid username" });
        } else {
            bcrypt.compare(req.body.password, user.password, (err, valid) => {
                if (err) {
                    res.status(400).json({ error: "Failed to authenticate." });
                } else if (valid) {
                    const token = jwt.encode({ username: user.username }, SECRET);
                    res.cookie("x-auth", token).redirect("/index");
                } else {
                    res.status(401).json({ error: "Wrong password" });
                }
            });
        }
    });
});

function getUser(req) {
    return new Promise((resolve, reject) => {
        if (!req.cookie["x-auth"]) {
            resolve(null);
        }

        const token = req.cookie["x-auth"];
        try {
            const decoded = jwt.decode(token, SECRET);

            User.findOne({ username: decoded }, (err, users) => {
                if (err) reject(err);

                if (!user) {
                    reject();
                } else {
                    resolve(decoded);
                }
            });
        } catch (ex) {
            reject(ex);
        }
    });
}
*/

module.exports = router;