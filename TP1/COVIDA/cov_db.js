'use strict'
const fs = require('fs')
const GROUPS_PATH = 'TP1/groups.json'
module.exports = () => {
    
    function createGroup(group_name,group_description,cb){
        fs.readFile(GROUPS_PATH, (err, buffer) => {
            if (err) cb(err)
            let groups = buffer.length > 0 ? JSON.parse(buffer) : []
            if(groups.some(group => group.name === group_name))
                return cb(new Error(`Can't create new group with ${group_name} because one already exists `))
            groups.push(newGroup(group_name,group_description,[]))
            fs.writeFile(GROUPS_PATH,JSON.stringify(groups),err => {
                if (err) {return cb(err)}
                cb(null,`Group ${group_name} created`)
            })
        })
    }

    function addToGroup(group_name,game_name,game_id,game_total_rating,cb){
        fs.readFile(GROUPS_PATH, 'utf8', (err, json) => {
            if (err)return cb(err)
            var groups = JSON.parse(json)
            console.log(`${group_name} X ${groups[0].name}`)
            if(groups.find(group => group.name === group_name)){
                groups.forEach(group => {  
                    if(group.name == group_name){
                        if(group.games.find(game => game.id == game_id)) return cb(new Error(`Can't add ${game_name} to group because it's already present`))
                        group.games.push(newGame(game_name,game_id,game_total_rating))
                        fs.writeFile(GROUPS_PATH,JSON.stringify(groups),err => {
                            if (err) return cb(err)
                            return cb(null,`Game ${game_name} added to ${group_name}`)
                        })
                    }
                })
            }else return cb(new Error(`Can't find group with name:${group_name}`))
        })
    }
    return {
         createGroup: createGroup,
         addToGroup: addToGroup,
         /*listGroups: listGroups,
         showGroup: showGroup,
         editGroup: editGroup,
         removeFromGroup: removeFromGroup,
         getGamesBetween: getGamesBetween*/
     }
}

function newGroup(group_name, group_description, games) {
    return {
        'name': group_name,
        'description': group_description,
        'games': games
    }
}

function newGame(game_name, game_id, game_rating) {
    return {
        'name': game_name,
        'id': game_id,
        'rating': game_rating
    }
}
function printLocalData(data){
    for(g in data){
        for(game in data[g].games){
            console.log(data[g].games[game])
        }
    }       
}
function fetchData(cb){
    fs.readFile(GROUPS_PATH, 'utf8', (err, json) => {
        if (err) {
            console.log("File read failed:", err)
        }
    })
}
