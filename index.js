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
const api = require("./routes/api.js")
app.use("/api", api)
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
            fs.appendFile(`./views/public/${req.body.wantlink}.ejs`, `Вас не редиректило потому что у вас не работает javascript, <a href="${req.body.tolink}">вот ваша ссылка на сайт редиректа</a> <script>window.location.href = "${req.body.tolink}";</script>`, function (err) {
                if (err) throw err;
                res.render("public/generated_redirect.ejs", {"link": `https://fuller.ml/${req.body.wantlink}`})
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
    let x = fs.readdirSync("./views/").length
    res.render("public/index.ejs", {
        "shorten": x,
        "visitors": visitors.size
    })
})

// Запускаем приложение на 3000 порте или на порте который в конфиге
app.listen(config.port || 3000, () => {
    log(`${new Date()} [LOG] Сервер запущен`)
})
