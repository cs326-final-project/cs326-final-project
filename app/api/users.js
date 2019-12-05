// User creation and authentication with password hashing.
// Code sourced from Zybooks 11.12 https://learn.zybooks.com/zybook/UMASSCOMPSCI326RichardsAcademicYear2020/chapter/11/section/12
const jwt = require("jwt-simple");
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt-nodejs");
const saltRounds = 10;

router.post("/user", (req, res) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, null, (err, hash) => {
            let newUser = new User({
                username: req.body.username,
                password: hash,
                email: email,
                status: req.body.status
            });

            newUser.save((err) => {
                if (err) {
                    res.status(500).json({ error: "Error creating user" });
                } else {
                    res.sendStatus(201); // New user created
                }
            });
        });
    });
});

router.post("/create", (req, res) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash("man", salt, null, (err, hash) => {
            let testUser = new User({
                username: "big",
                password: hash,
                email: "derpthemeus@gmail.com",
                status: req.body.status
            });

            testUser.save((err, testUser) => {
                res.send("user with name " + testUser.username + " was saved with ID of " + testUser._id);
            });
        });
    });
})

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
                    res.json({ token: token });
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
        const decoded = jwt.decode(token, SECRET);

        User.find({}, "username status", (err, users) => {
            res.json(users);
        });
    } catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
});

module.exports = router;

$(() => {
    let $password = $(".form-control[type='password']");
    let $passwordAlert = $(".password-alert");
    let $requirements = $(".requirements");
    let $leng = $(".leng");
    let $bigLetter = $(".big-letter");
    let $num = $(".num");
    let $specialChar = $(".special-char");
    let specialChars = "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~";
    let numbers = "0123456789";

    $password.on("focus", () => {
        $passwordAlert.show();
    });
});