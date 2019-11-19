// User creation and authentication with password hashing.
// Code sourced from Zybooks 11.12 https://learn.zybooks.com/zybook/UMASSCOMPSCI326RichardsAcademicYear2020/chapter/11/section/12
const jwt = require("jwt-simple");
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt-node.js");
const saltRounds = 10;

const secret = "secret";

router.post("/user", (req, res) => {

    bcrypt.hash("openplease", saltRounds, (err, hash) => {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            status: req.body.status
        });

        newUser.save((err) => {
            if (err) return next(err);
            res.sendStatus(201); // New user created
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
                    res.status(400).json({ error: err });
                } else if (valid) {
                    const token = jwt.encode({ username: user.username }, secret);
                    res.json({ token: tokent });
                } else {
                    res.status(401).json({ error: "Wrong password" });
                }
            });
        }
    });
});

router.get("/status", (req, res) => {
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth header" });
    }

    const token = req.headers["x-auth"];
    try {
        const decoded = jwt.decode(token, secret);

        User.find({}, "username status", (err, users) => {
            res.json(users);
        });
    } catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
});

module.exports = router;