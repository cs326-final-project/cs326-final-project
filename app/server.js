const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
const mongoose = require("mongoose");
const redditScraper = require("./scrapers/redditScraper");

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
app.use(router);

app.get("/analyzeData", async(req, res) => {
    console.log(`Received a request to analyze a user's data using Reddit authorization code "${req.query.redditCode}"`);
    const scrapedData = await redditScraper.scrapeUser(req.query.redditCode);
    // TODO add the user's data to the database, then analyze it and return the results.
    res.status(200).send(scrapedData);
});

//serve static files from public dir
app.use(express.static("public", { index: false, extensions: ["html"] }));
app.listen(3000);
