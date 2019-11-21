const db = require("../db");

// Create model from schema
const User = db.model("User", {
    username: { type: String, require: true },
    password: { type: String, required: true },
    status: String
});

module.exports = User;