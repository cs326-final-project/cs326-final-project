const db = require("../db");

// Create model from schema
const User = db.model("User", {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = User;