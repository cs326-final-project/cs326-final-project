// User creation and authentication with password hashing.
// Code sourced from Zybooks 11.12 https://learn.zybooks.com/zybook/UMASSCOMPSCI326RichardsAcademicYear2020/chapter/11/section/12
const jwt = require("jwt-simple");
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt-nodejs");
const getUser = require("./getUser");
require("dotenv").config({ path: __dirname + "/../private.env" });

const saltRounds = 10;
const SECRET = process.env.SECRET;

router.post("/user", (req, res) => {
    console.log(getUser(req));
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


module.exports = router;