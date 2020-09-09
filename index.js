// Импорты / глобальные переменные

const express = require("express")
const app = express()
const fs = require("fs")
const config = require("./config.json")
global.mongoose = require("mongoose")

// Подключение БД
mongoose.connect("mongodb://localhost:2000", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
  log(`${new Date()} [LOG] Подключился к базе данных`)
})

// Схемы
global.Visitors = require("./data/models/visitors.js")
// Роутеры
const psh = require("./routes/psh.js")
const api = require("./routes/api.js")
app.use("/api", api)
app.use("/p/", psh)
/////////////////////////////////////

// LOGGING ////////////////////
function log(log_data) {
    console.log(log_data)
    fs.appendFile('logs.txt', `${log_data}\n`, function (err) {
        if (err) throw err;
      });
}
//////////////////////

// Дабы мы могли получать инфу с запроса    
app.use(express.urlencoded({ extended: false }))
////////////////////////////////////////////////

// Авто рендер страниц
app.get("/:page", (req, res) => {
    if(req.params.page === "dashbord") {
        return
    }
    let page = fs.readFile(`./views/public/${req.params.page}.ejs`, (err, data) => {
        if(data != undefined) {
            res.render(`public/${req.params.page + ".ejs"}`)
        } else {
            res.render("public/404.ejs")
        }
        });   
})

// Создание редиректа

app.post("/create", (req, res) => {
    // если нету данных то кидаем его на страницу об ошибке
    if(!req.body.tolink || !req.body.wantlink) {
        res.render("public/you_dont_write_all_data.ejs")
        return
    }
    
    // Читаем файл редиректа который хочет пользователь
    fs.readFile(`./views/public/${req.body.wantlink}.ejs`, (err, data) => {
        // Если дата известна то кидаем на ошибку
        if(data !== undefined) {
            res.render("public/error_redirect_just_have.ejs")
        } else { // Если нет то делаем редирект
            let title = req.body.title || "Пользователь не поставил название"
            let description = req.body.description || "Пользователь не поставил описание"
            let color = req.body.color || "#000000"
            let picture = req.body.picture || ""

            fs.appendFile(`./views/public/${req.body.wantlink}.ejs`, `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:type" content="website">
    <meta name="theme-color" content="${color}">
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="fuller.glitch.me" />
    <meta property="og:image" content="${picture}" />
    <title>${title}</title>
</head>
<body>
    Вас не редиректило потому что у вас не работает javascript, <a href="${req.body.tolink}">вот ваша ссылка на сайт редиректа</a> 
    <script>window.location.href = "${req.body.tolink}";</script>
</body>
</html>
            `, function (err) {
                if (err) throw err;
                res.render("public/generated_redirect.ejs", {"link": `https://fuller.glitch.me/${req.body.wantlink}`})
              });
        }
      });
})

// Главная страница
app.get("/", async(req, res) => {
    let visitors = await Visitors.findOne({ _id: 1 });
    if(!visitors) { Visitors.create({ _id: 1, size: 1}); log(`${new Date()} [LOG] База данных статистики была создана`) }
    visitors.size++
    visitors.save()
    let x = fs.readdirSync("./views/public/").length
    res.render("public/index.ejs", {
        "shorten": x,
        "visitors": visitors.size
    })
})

// Запускаем приложение на 3000 порте или на порте который в конфиге
app.listen(config.port || 3000, () => {
    log(`${new Date()} [LOG] Сервер запущен`)
})
