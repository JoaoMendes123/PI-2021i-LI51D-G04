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
          console.log(games)
        })
    }

    function createGroup(name, desc, callback){

    }

    function editGroup(group, name, desc, callback){

    }

    function listGroups(callback){

    }

    function showGroup(group, callback){

    }

    function addToGroup(game, group, callback){

    }

    function removeFromGroup(game, group, callback){

    }

    function getGamesBetween(min, max, group, callback){

    }

} 