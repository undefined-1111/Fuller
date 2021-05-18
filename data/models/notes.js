const mongoose = require("mongoose")
const schema = mongoose.Schema({
    note: String,
    name: String
});

module.exports = mongoose.model("notes", schema)