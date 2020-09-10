const express = require("express")
const router = express.Router()
const fs = require("fs")

router.use(express.urlencoded({ extended: false }))

router.get("/", (req, res) => {
    res.render("public/psh.ejs")
})

// Авто рендер страниц
router.get("/:page", (req, res) => {
    if(req.params.page === "dashbord") {
        return
    }
    let page = fs.readFile(`./views/public/p/${req.params.page}.ejs`, (err, data) => {
        if(data != undefined) {
            res.render(`public/p/${req.params.page + ".ejs"}`)
        } else {
            res.render("public/404.ejs")
        }
        });   
})

router.post("/add", (req, res) => {
    // если нету данных то кидаем его на страницу об ошибке
    if(!req.body.code || !req.body.link) {
        res.render("public/you_dont_write_all_data.ejs")
        return
    }
    
    fs.readFile(`./views/public/p/${req.body.wantlink}.ejs`, (err, data) => {
        // Если дата известна то кидаем на ошибку
        if(data !== undefined) {
            res.render("public/error_redirect_just_have.ejs")
        } else { // Если нет то делаем страницу
            fs.appendFile(`./views/public/p/${req.body.link}.ejs`, `${req.body.code}`, function (err) {
                if (err) console.log(err)
                res.redirect(`/p/${req.body.link}`)
            });
        }
        });
})

module.exports = router