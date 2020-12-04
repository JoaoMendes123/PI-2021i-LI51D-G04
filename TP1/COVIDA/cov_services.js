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
      console.log("cov.services")
        igdb.searchGames(str, (err,games) => {
          callback(games)
        })
    }

    function createGroup(name, desc, callback){
        covDB.createGroup(name, desc, (err, succ) => {
            callback(err, succ)
        })
    }

    function editGroup(group, name, desc, callback){
        covDB.editGroup(group, name, desc, (err, succ) => {
            callback(err, succ)
        })
    }

    function listGroups(callback){
        covDB.listGroups((err, group) => {
            console.log(group)
            callback(group)
        })
    }

    function showGroup(group, callback){
        covDB.showGroup(group, (err,succ) => {
            callback(err, succ)
        })
    }

    function addToGroup(id, group, callback){
      igdb.getGame(id, (err, game) => {
        console.log(game)
        covDB.addToGroup(group, game, (err, succ) => {
            callback(err, succ)
        })
      })
    }

    function removeFromGroup(game, group, callback){

    }

    function getGamesBetween(min, max, group, callback){

    }

} 