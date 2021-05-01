const mongoose = require("mongoose")
const schema = mongoose.Schema({
    siteto: String,
    name: String
});

module.exports = mongoose.model("shorted", schema)