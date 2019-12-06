const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/user");

const mongoose = require("mongoose");

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
router.use("/api", require("./api/scrapeData"));

app.use(router);


//serve static files from public dir
app.use(express.static("public", { index: false, extensions: ["html"] }));
app.listen(3000);
