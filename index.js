const express = require("express")
const app = express()
const chalk = require("chalk")
const mongoose = require("mongoose")
const crypto = require("./functions/get.js")
const config = require("./config.json")
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


app.get("/admin", (req,res) => {
    if(req.query.nick !== config.nick) {
        if(req.query.pass !== config.pass) {
            res.render("admin/login.ejs")
        } else {
            res.render("admin/login.ejs")
        }
    } else if (req.query.nick === config.nick) {
        if(req.query.pass === config.pass) {
            res.render("admin/panel.ejs")
        }
    }
})

app.get("/admin/admin-eval", (req,res) => {
    if(req.query.pass !== config.pass) return
    let evaled = eval(req.query.eval)
    res.send(evaled)
})

app.get("/admin/admin-cmd", async(req,res) => {
    if(req.query.pass !== config.pass) return
    const { exec } = require("child_process");

    exec(req.query.cmd, (error, stdout, stderr) => {
        if (error) {
            res.send(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            res.send(`stderr: ${stderr}`);
            return;
        }
        res.send(`stdout: ${stdout}`);
    });
})

app.get("/cryptocurrency", async(req,res) => {
    res.render("crypto.ejs")
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

app.get("/api/getmonero", (req,res) => {
    crypto.run("xmr").then(data => {
        res.send(`${data}`)
    })
})

app.get("/api/getbtc", (req,res) => {
    crypto.run("btc").then(data => {
        res.send(`${data}`)
    })
})

app.get("/api/geteth", async(req,res) => {
    crypto.run("eth").then(data => {
        res.send(`${data}`)
    })
})

app.get("/api/getdoge", async(req,res) => {
    crypto.run("doge").then(data => {
        res.send(`${data}`)
    })
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
