const express = require("express")
const app = express()
const chalk = require("chalk")
const mongoose = require("mongoose")
app.use(express.urlencoded({ extended: false }))

mongoose.connect("", { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected',()=>{
    console.log(
        chalk.bold(
            chalk.green("[ 200 ] Connected to db")
        )
    )
})

app.get("/", (req,res) => {
    res.render("index.ejs")
})

app.get("/:site", async(req,res) => {
    let aname = req.params.site 
    let shorted = require("./data/models/shorted.js")
    let finding = await shorted.findOne({name: aname})
    if(!finding) {
        res.render("404.ejs")
        return
    } else {
        res.redirect(finding.siteto)
        return
    }
})

app.post("/create", async(req,res) => {
    let shorted = require("./data/models/shorted.js")
    let finding = await shorted.findOne({name: req.body.wantlink})
    if(!finding) {
        let create = await shorted.create({
            siteto: req.body.tolink,
            name: req.body.wantlink,
        })
        res.render("created.ejs", {
            link: req.body.wantlink
        })
        return
    } else {
        res.render("this_redirectname_just_have.ejs")
        return
    }
})

app.listen(3000, () => {
    console.log(
        chalk.bold(
            chalk.green("[ LOG ] Started")
        )
    )
})
