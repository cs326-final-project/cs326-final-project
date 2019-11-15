const jwt = require("jwt-simple");
const User = require("../models/user");
const router = require("express").Router();

const secret = "secret";

router.post("/user", (req, res) => {
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

router.post("/auth", (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.status(401).json({ error: "Invalid username" });
        } else {
            if (user.password != req.body.password) {
                res.status(401).json({ error: "Wrong password" });
            } else {
                const token = jwt.encode({ username: user.username }, secret);
                res.json({ token: tokent });
            }
        }
    });
});

router.get("/status", (req, res) => {
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth header" });
    }

    const token = req.headers["x-auth"];
    try {
        const decoded = jwt.decode(tokent, secret);

        User.find({}, "username status", (err, users) => {
            res.json(users);
        });
    } catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
});

module.exports = router;