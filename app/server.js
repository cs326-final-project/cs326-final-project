const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jwt-simple");

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

app.get("/create", (req, res) => {
    //for testing let's create a user instance
    let testUser = new User({
        userName: "big",
        password: "man"
    });
    testUser.save((err, testUser) => {
        res.send("user with name " + testUser.userName + " was saved with ID of " + testUser._id);
    });
});

app.get("/analyzeData", (req, res) => {
    // TODO we need to get the user's Reddit username. Can this be obtained through the API by checking the owner of the auth code, or does a field need to be added to the website?
    console.log(`Received a request to analyze a user's data using Reddit authorization code "${req.query.redditCode}"`);
    res.status(200).send("We have analyzed your data and determined you don't shitpost on Reddit enough. Thank you, have a nice day.");
});

//serve static files from public dir
app.use(express.static("public"));
app.listen(3000);