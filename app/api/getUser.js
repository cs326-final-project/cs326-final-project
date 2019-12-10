const jwt = require("jwt-simple");
const User = require("../models/user");
require("dotenv").config({ path: __dirname + "/../private.env" });

const SECRET = process.env.SECRET;

function getUser(req) {
    return new Promise((resolve, reject) => {
        if (!req.cookies["x-auth"]) {
            resolve(null);
        }

        const token = req.cookies["x-auth"];
        try {
            const decoded = jwt.decode(token, SECRET);

            User.findOne({ username: decoded.username }, (err, user) => {
                if (err) reject(err);

                if (!user) {
                    reject();
                } else {
                    resolve(user);
                }
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

function showUser(cookie) {
    return new Promise((resolve, reject) => {
        if (!cookie) {
            resolve(null);
        }

        const token = cookie;
        try {
            const decoded = jwt.decode(token, SECRET);

            User.findOne({ username: decoded.username }, (err, user) => {
                if (err) reject(err);

                if (!user) {
                    reject();
                } else {
                    resolve(user);
                }
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

module.exports = getUser;