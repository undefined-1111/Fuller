const express = require("express")
const app = express()
const chalk = require("chalk")
const mongoose = require("mongoose")
app.use(express.urlencoded({ extended: false }))
app.use(express.static("views"))

mongoose.connect("mongodb+srv://undefined:8kLbQ18n2zfQemlF@cluster0.wks5o.mongodb.net/fuller", { useNewUrlParser: true, useUnifiedTopology: true }).catch(() => {
    console.log(
        chalk.bold(
            chalk.red(`[ ERR ] Not connected to db!`)
        )
    )
})
mongoose.connection.on('connected',()=>{
    console.log(
        chalk.bold(
            chalk.green("[ OK ] Connected to db")
        )
    )
})

app.get("/notes-main", (req,res) => {
    res.render("notes/notes-main.ejs")
})

app.get("/", (req,res) => {
    res.render("shorter/index.ejs")
})

app.get("/:site", async(req,res) => {
    let aname = req.params.site 
    let shorted = require("./data/models/shorted.js")
    let finding = await shorted.findOne({name: aname})
    if(!finding) {
        let notes = require("./data/models/notes.js")
        finding = await notes.findOne({name: aname})
        if(!finding) {
            res.render("404.ejs")
        } else {
            res.render("notes/viewanote.ejs", {
                note: finding.note
            })
        }
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
        res.render("shorter/redirect-created.ejs", {
            wantlink: req.body.wantlink
        })
        return
    } else {
        res.render("shorter/this_redirectname_just_have.ejs")
        return
    }
})

app.post("/create-note", async(req,res) => {
    let notes = require("./data/models/notes.js")
    let finding = await notes.findOne({name: req.body.wantlink})
    if(!finding) {
        let create = await notes.create({
            note: req.body.notetext,
            name: req.body.wantlink,
        })
        res.render("notes/note-created.ejs", {
            wantlink: req.body.wantlink
        })
        return
    } else {
        res.render("notes/this_notename_just_have.ejs")
        return
    }
})

app.listen(3000, async () => {
    console.log(
        chalk.bold(
            chalk.blueBright(
                `


                ███████╗██╗░░░██╗██╗░░░░░██╗░░░░░███████╗██████╗░
                ██╔════╝██║░░░██║██║░░░░░██║░░░░░██╔════╝██╔══██╗
                █████╗░░██║░░░██║██║░░░░░██║░░░░░█████╗░░██████╔╝
                ██╔══╝░░██║░░░██║██║░░░░░██║░░░░░██╔══╝░░██╔══██╗
                ██║░░░░░╚██████╔╝███████╗███████╗███████╗██║░░██║
                ╚═╝░░░░░░╚═════╝░╚══════╝╚══════╝╚══════╝╚═╝░░╚═╝
                
                
                `
            )
        )
    )
    console.log(
        chalk.bold(
            chalk.green("[ OK ] Started web server")
        )
    )

    try {
        const ngrok = require("ngrok")
        const url = await ngrok.connect(3000);

        console.log(
            chalk.bold(
                chalk.green(`[ OK ] Ngrok created! ${url}`)
            )
        )
    } catch {
        console.log(
            chalk.bold(
                chalk.red(`[ ERR ] Ngrok not created!`)
            )
        )
    }
})
