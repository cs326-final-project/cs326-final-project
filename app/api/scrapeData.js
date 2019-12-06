const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/user");
const RedditDataModel = require("../models/redditData");
const FacebookDataModel = require("../models/facebookData");
const db = require("../db");
const mongoose = require("mongoose");
const redditScraper = require("../scrapers/redditScraper");
const facebookScraper = require("../scrapers/facebookScraper");

//url param indicates machine mongodb is running on /nameOfDatabase

const router = require("express").Router();

router.post("/scrapeData", async (req, res) => {
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

module.exports = router;