const express = require("express")
const router = express.Router()
const fs = require("fs")

router.get("/", (req, res) => {
    res.send({
        "info": "API fuller.ml",
        "shorten-links": "/shorten-links [METHOD: GET]",
        "create-shorten-link": `/create-shorten-link?tolink=[to link]&wantlink=[want link] [METHOD: POST]`,
        "check-shorten-link": "/check-url/:link [METHOD: GET]"
    })
}) 

router.get("/shorten-links", (req, res) => {
    try {
        let shorten = fs.readdirSync("views/public").length
        res.send({
            "status": "succefull",
            "size": shorten 
        })
    } catch {
        res.send({"status": "error"})
    }
})

router.post("/create-shorten-link/", (req, res) => {
    if(!req.query.tolink || !req.query.wantlink) {
        res.send({"error": "you don't write all data"})
        return
    }

    if(!req.query.tolink.startsWith("https://" || "http://")) {
        res.send({
            "error": "Please give me link"
        })
    }

    fs.readFile(`./views/public/${req.query.wantlink}.ejs`, (err, data) => {
        if(data !== undefined) {
            res.send({
                "error": "This url just have"
            })
        } else {
            fs.appendFile(`./views/public/${req.query.wantlink}.ejs`, `Вас не редиректило потому что у вас не работает javascript, <a href="${req.query.tolink}">вот ваша ссылка на сайт редиректа</a> <script>window.location.href = "${req.query.tolink}";</script>`, function (err) {
                if (err) throw err;
                res.send({
                    "status": "sucefull"
                })
              });
        }
      });
})

router.get("/check-url/:link", (req, res) => {
    fs.readFile(`./views/${req.params.link}.ejs`, (err, data) => {
        if(err) {
            res.send({
                "status": false
            })
        } else {
            res.send({
                "status": true
            })
        }
    })
})
module.exports = router