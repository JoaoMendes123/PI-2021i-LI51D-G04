'use strict'

const http = require('https')
//const base_url = "https://api.igdb.com/v4/games/"
const CLIENT_ID = 'ko2c8v3hhmzujhpitxqgigsdzg0ay0'
const ACCESS_TOKEN = 'Bearer vkbwpa4vh3tuq9dmmdncywum31jauv'

module.exports = {
    searchGames,
    getGame
}

function searchGames(name, cb) {
    const content = "fields name, rating, id; search \""+name+"\";"
    const options = {
        hostname : 'api.igdb.com',
        path: '/v4/games/',
        method: 'POST',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
    }
    var games = ''
    const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
            games += d;
            console.log(`body = ${games}`);
        }) 
        res.on('close', () =>{
            cb(null, games) 
        })     
    })
    req.on('error', error =>{
        console.error(error)
    })
    req.write(content)
    req.end()
}

function getGame(id, cb){
    console.log(id)
    const content = `fields name, total_rating, id; where id = ${id};`
    const options = {
        hostname : 'api.igdb.com',
        path: '/v4/games/',
        method: 'POST',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
    }
    var game = ''
    const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
            game += d;
        }) 
        res.on('close', () =>{
            cb(null, JSON.parse(game)) 
        })     
    })
    req.on('error', error =>{
        console.error(error)
    })
    req.write(content)
    req.end()
}