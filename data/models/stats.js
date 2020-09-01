const mongoose = require("mongoose")
const schema = mongoose.Schema({
    date: String,
    size: Number
});

module.exports = mongoose.model("stats", schema)