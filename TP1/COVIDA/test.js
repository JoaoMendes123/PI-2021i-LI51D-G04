'use strict'

const { httpsAgent } = require('urllib')

urllib = require('urllib')
const base_url = "https://api.igdb.com/v4/games/"
const client_id = "CLIENT_ID:ko2c8v3hhmzujhpitxqgigsdzg0ay0"
const access_token = "Bearer vkbwpa4vh3tuq9dmmdncywum31jauv"

function searchgame(name, cb){
    httpsAgent.requests(base_url, {
        method: "POST",
        headers:{
            'CLIENT-ID': client_id,
            'Authorization': access_token,
            'Content-Type': "text/plain"
    }, 
        content: "fields name, rating, id; search"+name
        
    })
}

searchgame(witcher, rsp => {
    console.log(rsp)
})