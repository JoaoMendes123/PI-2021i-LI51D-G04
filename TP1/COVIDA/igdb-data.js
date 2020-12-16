'use strict'
const resources = require('./resources')
const http = require('https')
//const base_url = "https://api.igdb.com/v4/games/"
const CLIENT_ID = 'ko2c8v3hhmzujhpitxqgigsdzg0ay0'
const ACCESS_TOKEN = 'Bearer vkbwpa4vh3tuq9dmmdncywum31jauv'

module.exports = {
    searchGames,
    getGame
}

function searchGames(name) {
    return new Promise((resolve, reject) => {
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
                if(games.length > 2) resolve(games)
                else reject(new resources.Error(`No matches found on the search for ${name}`, 406))
            })     
        })
        req.on('error', error =>{
            reject(new resources.Error(error, 500))
        })
        req.write(content)
        req.end()
    })
}

function getGame(id){
    return new Promise((resolve, reject) => {
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
                console.log(res.statusCode)
                if(res.statusCode == 200 && game.length > 2) return resolve(JSON.parse(game))
                else return reject(new resources.Error(`Cannot find game ${id}, please make sure the ID is valid`, 406))
            })     
        })
        req.on('error', error =>{
        reject(new resources.Error(error, 500))
        })
        req.write(content)
        req.end()
    })    
}