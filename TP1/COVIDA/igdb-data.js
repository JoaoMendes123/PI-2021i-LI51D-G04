'use strict'

const http = require('https')
//const base_url = "https://api.igdb.com/v4/games/"
const CLIENT_ID = 'ko2c8v3hhmzujhpitxqgigsdzg0ay0'
const ACCESS_TOKEN = 'Bearer vkbwpa4vh3tuq9dmmdncywum31jauv'

module.exports = {
    searchGames
}

function searchGames(name, cb) {
    console.log("igdbdata")
    const content = "fields name, rating, id; search \""+name+"\";"
    const options = {
        hostname : 'api.igdb.com',
        path: '/v4/games/',
        method: 'POST',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': ACCESS_TOKEN,
            'Content-Type': 'text/plain'
        },
    }
    const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
            const games = d.toString('utf8')
            cb(null, games)
        })
    })
    req.on('error', error =>{
        console.error(error)
    })
    req.write(content)
    req.end()
    /*urllib.request(base_url, {
        method: "POST",
        headers:{
            'CLIENT-ID': client_id,
            'Authorization': access_token,
            'Content-Type': "text/plain"
        }, 
        content: "fields name, rating, id; search"+name
    }, (err, data, res) => {
        if(err) return cb(err)
        cb(null, res)
    })*/
}