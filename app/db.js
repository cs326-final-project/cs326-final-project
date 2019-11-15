const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost/mirrordb");
module.exports = mongoose;