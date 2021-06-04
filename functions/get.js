module.exports.run = async function run(cryptoname) {
    const cherio = require("cherio")
    const fetch = require("node-fetch")

    let fetched = await fetch(`https://pokur.su/${cryptoname}/uah/1/`)
    fetched = await fetched.text()

    const $ = await cherio.load(fetched)

    let parsed = []

    $(".form-control").each((i, a) => {
        parsed.push($(a).val())
    })

    return parsed
}