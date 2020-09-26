const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const stat = require("../data/models/stats.js")

function getdate() {
    return `${new Date().getDate()}`
}

router.get("/", async(req, res) => {
    let stata = await stat.findOne({
        date: getdate() 
    })
    if(!stata) {
        await stat.create({
            date: getdate(),
            size: 0
        })
    }
    await stata.size++
    await stata.save()
    await res.send("Ты отправил запрос статистики")
})

module.exports = router