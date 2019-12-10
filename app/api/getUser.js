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

module.exports = getUser;