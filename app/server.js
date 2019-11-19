const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jwt-simple");
const mongoose = require("mongoose");
const handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const layouts = require("handlebars-layouts");
const redditScraper = require("./scrapers/redditScraper");

//url param indicates machine mongodb is running on /nameOfDatabase
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost/mirrordb");


// https://learn.zybooks.com/zybook/UMASSCOMPSCI326RichardsAcademicYear2020/chapter/11/section/8
//Schema defines the structure of documents within
// a MongoDB collection
const userSchema = new mongoose.Schema({
    userName: { type: String, require: true },
    password: { type: String, require: true },
    status: String
});

// a Model is a constructor compiled from a schema
// instance of model represent MongoDB documnets that can be saved or written
// two params modelName: name of model's collection, and schema: previously defined schema
const User = mongoose.model("User", userSchema);

module.exports = User;

const app = express();
const router = express.Router();

<<
<< << < HEAD
app.get("/create", (req, res) => { ===
            === =
            // Setup Handlebars and addons.
            layouts.register(handlebars);
            const viewsPath = __dirname + "/views";
            app.engine("handlebars", expressHandlebars({
                defaultLayout: null
            }));
            app.set("view engine", "handlebars");
            app.set("views", viewsPath);
            handlebars.registerPartial("layout", fs.readFileSync(viewsPath + "/layout.handlebars", "utf8"));

            app.get("/create", (req, res) => { >>>
                >>> > dev
                //for testing let's create a user instance
                let testUser = new User({
                    userName: "big",
                    password: "man"
                });
                testUser.save((err, testUser) => {
                    res.send("user with name " + testUser.userName + " was saved with ID of " + testUser._id);
                });
            });

            app.get("/analyzeData", async(req, res) => {
                console.log(`Received a request to analyze a user's data using Reddit authorization code "${req.query.redditCode}"`);
                const scrapedData = await redditScraper.scrapeUser(req.query.redditCode);
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