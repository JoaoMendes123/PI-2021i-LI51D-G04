'use strict'
const resources = require('./resources')
const fetch = require('node-fetch')
//const base_url = "https://api.igdb.com/v4/games/"
const CLIENT_ID = 'ko2c8v3hhmzujhpitxqgigsdzg0ay0'
const ACCESS_TOKEN = 'Bearer vkbwpa4vh3tuq9dmmdncywum31jauv'

module.exports = {
    searchGames,
    getGame
}

function searchGames(name) {
    const body = "fields name, total_rating, id; search \""+name+"\";"
    return fetch('https://api.igdb.com/v4/games/', {
        method: 'POST',
        body: body,
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': ACCESS_TOKEN,
            'Content-Type': 'application/json'
        }
    })
    .then((res) => res.json())
    .then(res => {
        if(res.length > 0) return res
        else throw new resources.dbError(`No matches found on the search for ${name}`, 400)
    })
}

async function getGame(id){
    const body = `fields name, total_rating, id; where id = ${id};`
    return fetch('https://api.igdb.com/v4/games/', {
        method: 'POST',
        body: body,
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': ACCESS_TOKEN,
            'Content-Type': 'application/json'
        }
    })
    .then((res => res.json()))
    .then((res) => {
        if(res.length > 0) return res
        else throw new resources.dbError(`Cannot find game ${id}, please make sure the ID is valid`, 400)
    })
}