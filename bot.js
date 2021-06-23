const TelegramBot = require('node-telegram-bot-api')
const config = require("./config.json")
const bot = new TelegramBot(config.tokenbot, {polling: true})
const fetch = require("node-fetch")

bot.on('message', async(msg) => {
    let args = msg.text.split(" ")

    if(args.length < 2) {
        bot.sendMessage(msg.chat.id, "Привет 👋 Это бот Fuller - Скорачиватель ссылок\nЧтобы сделать сокращение надо написать: \n\n(название редиректа)   (ссылка)")
        return
    } else {
        let request = await fetch("http://localhost:3000/create", {
        method: 'POST',
        body: `tolink=${args[1]}&wantlink=${args[0]}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
    request = await request.text()
    bot.sendPhoto(msg.chat.id, "./img/fuller.png").then(() => {
        bot.sendMessage(msg.chat.id, `
Готово                                                             🔗
http://www.fullershorter.ml/${args[0]}                          🔗`)
    })
}})
