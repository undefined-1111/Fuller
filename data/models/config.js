const mongoose = require("mongoose")
const schema = mongoose.Schema({
    _id: Number,
    adminlogin: String,
    adminpassword: String
});

module.exports = mongoose.model("config", schema)