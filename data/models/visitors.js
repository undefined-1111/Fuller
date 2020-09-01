const mongoose = require("mongoose")
const schema = mongoose.Schema({
    _id: Number,
    size: Number
});

module.exports = mongoose.model("visitors", schema)