const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
const redditData = require("./models/redditData");

const mongoose = require("mongoose");
const handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const layouts = require("handlebars-layouts");
const redditScraper = require("./scrapers/redditScraper");
const db = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/public.env" });
dotenv.config({ path: __dirname + "/private.env" });

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

// Setup Handlebars and addons.
layouts.register(handlebars);
const viewsPath = __dirname + "/views";
app.engine("handlebars", expressHandlebars({
    defaultLayout: null
}));
app.set("view engine", "handlebars");
app.set("views", viewsPath);
handlebars.registerPartial("layout", fs.readFileSync(viewsPath + "/layout.handlebars", "utf8"));

app.get("/analyzeData", async(req, res) => {
    console.log(req.query); // i want to get the user id from this
    // console.log(`Received a request to analyze a user's data using Reddit authorization code "${req.query.redditCode}"`);
    const scrapedData = await redditScraper.scrapeUser(req.query.redditCode);
    let redditDataId;
    // save reddit data
    try {
        db.RedditData.save(scrapedData, function(error){
            if (error){
                return;   
            } 
            // get id of saved data to link to user
            else{
                redditDataID = scrapedData._id;
            }
        });
    }
    catch (error){
        console.log(error);
        return;
    }
    // if we saved the scrapedData and got the document id
    // we will need to know the user's id in order to update with redditDataID
    if (redditDataId && req.query.userID) {
        // db.COLLECTION_NAME.update(SELECTION_CRITERIA, UPDATED_DATA)
        db.User.update({_id: req.query.userID},
            {$set:{'redditDataID':redditDataId}})
    }
    // update user redditID field
    // TODO add the user's data to the database, then analyze it and return the results.
    res.status(200).send(scrapedData);
});

app.get("/", (req, res) => {
    res.status(200).render("index", {});
});

// TODO remove this test page.
app.get("/cool", (req, res) => {
    res.status(200).render("cool", {});
});

app.get("/connectAccounts", (req, res) => {
    res.status(200).render("connectAccounts", {});
});

//serve static files from public dir
app.use(express.static("public"));
app.listen(3000);