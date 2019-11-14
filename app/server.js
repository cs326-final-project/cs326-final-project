const express = require("express");
const mongoose = require("mongoose");

//url param indicates machine mongodb is running on /nameOfDatabase
mongoose.connect("mongodb://localhost/mirrordb");


// https://learn.zybooks.com/zybook/UMASSCOMPSCI326RichardsAcademicYear2020/chapter/11/section/8
//Schema defines the structure of documents within
// a MongoDB collection
const userSchema = new mongoose.Schema({
    userName: { type:String, require: true},
    password: {type: String, require: true}
});

// a Model is a constructor compiled from a schema
// instance of model represent MongoDB documnets that can be saved or written
// two params modelName: name of model's collection, and schema: previously defined schema
const User = mongoose.model("User", userSchema);

const app = express();

app.get("/create", (req,res) => {
    //for testing let's create a user instance
    let testUser = new User({
        userName: "big",
        password: "guy"
    });
    testUser.save((err,testUser)=> {
        res.send("user with name "+testUser.userName + " was saved with ID of " + testUser._id);
    });
});

//serve static files from public dir
app.use(express.static("public"));
app.listen(3000);