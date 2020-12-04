'use strict'
const igdb = require('./igdb-data')
module.exports = function(covDB) {
    if(!covDB) {
      throw "Invalid covDB object"
    }
    
    return{
        searchGames:searchGames,
        createGroup:createGroup,
        editGroup:editGroup,  
        listGroups:listGroups,
        showGroup:showGroup,
        addToGroup:addToGroup,
        removeFromGroup:removeFromGroup,
        getGamesBetween:getGamesBetween
    }


    function searchGames(str, callback){
        igdb.searchGames(str, (err, games, status) => {
          callback(err, games, status)
        })
    }

    function createGroup(name, desc, callback){
        covDB.createGroup(name, desc, (err, succ, status) => {
            callback(err, succ, status)
        })
    }

    function editGroup(group, name, desc, callback){
        covDB.editGroup(group, name, desc, (err, succ, status) => {
            callback(err, succ, status)
        })
    }

    function listGroups(callback){
        covDB.listGroups((err, group, status) => {
            callback(err, group, status)
        })
    }

    function showGroup(group, callback){
        covDB.showGroup(group, (err,succ, status) => {
            callback(err, succ, status)
        })
    }

    function addToGroup(id, group, callback){
        igdb.getGame(id, (err, game, status) => {
            if(status) callback(err, null, status)
            covDB.addToGroup(group, game[0], (err, status) => {
                callback(err, game[0], status)
            })
         })
    }

    function removeFromGroup(game, group, callback){
        igdb.getGame(game, (err, game, status) => {
            if(status) callback(err, null, status)
            covDB.removeFromGroup(group, game[0], (err, status) => {
                callback(err, game[0], status)
            })
        })
    }

    function getGamesBetween(group, max, min, callback){
        covDB.getGamesBetween(group, max, min, (err, succ, status) => {
            callback(err, succ, status)
        })
    }

} 