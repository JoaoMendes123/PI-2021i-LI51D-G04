/*'use strict'
const resources = require('./resources')
const http = require('https')
//const base_url = "https://api.igdb.com/v4/games/"
const CLIENT_ID = 'ko2c8v3hhmzujhpitxqgigsdzg0ay0'
const ACCESS_TOKEN = 'Bearer vkbwpa4vh3tuq9dmmdncywum31jauv'

module.exports = {
    searchGames,
    getGame
}

function igdbsearchGames(name) {
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
                if(res.statusCode == 200 && game.length > 2) resolve(JSON.parse(game))
                else if(res.statusCode != 200) reject(new Error(`Error accessing IGDB API`, res.statusCode))
                else reject(new resources.Error(`Cannot find game ${id}, please make sure the ID is valid`, 406))
            })     
        })
        req.on('error', error =>{
        reject(new resources.Error(error, 500))
        })
        req.write(content)
        req.end()
    })    
}

function searchGames(str){
    return new Promise((resolve, reject) => {
        igdbsearchGames(str)
            .then((games) => {
                resolve(games)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function createGroup(name, desc){
    return new Promise((resolve, reject) => {
        covDB.createGroup(name, desc)
            .then((res) => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function editGroup(group, name, desc){
    return new Promise((resolve, reject) => {
        covDB.editGroup(group, name, desc)
            .then((res) => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function listGroups(){
    return new Promise((resolve, reject) => {
        covDB.listGroups()
            .then((res) => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function showGroup(group){
    return new Promise((resolve, reject) => {
        covDB.showGroup(group) 
            .then((res)=> {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function addToGroup(id, group){
    return new Promise((resolve, reject) => {
        getGame(id)
            .then((game) => {
                covDB.addToGroup(group, game[0])
                    .then(resolve(game[0]))
                    .catch((err) => reject(err))
            })
            .catch((err) => reject(err))
    })
}

function removeFromGroup(game, group){
    return new Promise((resolve, reject) => {
        getGame(game)
            .then((game) => {
                removeFromGroup(group, game[0])
                    .then((g) => resolve(g))
                    .catch((err) => reject(err))
                })
            .catch((err) => reject(err))    
    })
}

function getGamesBetween(group, max, min){
    return new Promise((resolve, reject) => {
        getGamesBetween(group, max, min)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => reject(err))
    })
}

function promiseTest() {
    return new Promise((resolve, reject) => {
        resolve({
            name: "test1",
            number: 12
        })
        reject("bye")
    })
}
promiseTest().then((res) => {
    console.log(res.name)
    console.log(res.number)
})*/