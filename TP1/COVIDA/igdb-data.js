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
    const content = "fields name, total_rating, id; search \""+name+"\";"
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
        res.on('data', d => {
            games += d;
        }) 
        res.on('close', () =>{
            if(games.length > 2) cb(null, games) 
            else cb(new Error(`No matches found on the search for ${name}`), null, 404)
        })     
    })
    req.on('error', error =>{
        cb(error, null, 500)
    })
    req.write(content)
    req.end()
}

function getGame(id, cb){
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
        res.on('data', d => {
            game += d;
        }) 
        res.on('close', () =>{
            if(res.statusCode == 200 && game.length > 2) cb(null, JSON.parse(game))
            else if(res.statusCode != 200) cb(new Error(`Error accessing IGDB API`), null, res.statusCode)
            else cb(new Error(`Cannot find game ${id}, please make sure the ID is valid`), null, 404)
        })     
    })
    req.on('error', error =>{
        cb(error, null, 500)
    })
    req.write(content)
    req.end()
}