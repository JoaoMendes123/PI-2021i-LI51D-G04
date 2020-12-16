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


    function searchGames(str){
        return new Promise((resolve, reject) => {
            igdb.searchGames(str)
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
    
    function editGroup(groupID, name, desc){
        return new Promise((resolve, reject) => {
            covDB.editGroup(groupID, name, desc)
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
    
    function showGroup(groupID){
        return new Promise((resolve, reject) => {
            covDB.showGroup(groupID) 
                .then((res) => {
                    resolve(res)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    
    function addToGroup(gameID, groupID){
        return new Promise((resolve, reject) => {
            igdb.getGame(gameID)
                .then((game) => {
                    covDB.addToGroup(groupID, game[0])
                        .then((groupName) => {
                            resolve({
                                group: groupName,
                                game: game[0].name
                            })

                        })
                        .catch((err) => reject(err))
                })
                .catch((err) => reject(err))
        })
    }
    
    function removeFromGroup(groupID, gameID){
        return new Promise((resolve, reject) => {
            igdb.getGame(gameID)
                .then((game) => {
                    covDB.removeFromGroup(groupID, game[0])
                        .then((g) => resolve(g))
                        .catch((err) => reject(err))
                    })
                .catch((err) => reject(err))    
        })
    }
    
    function getGamesBetween(groupID, max, min){
        return new Promise((resolve, reject) => {
            covDB.getGamesBetween(groupID, max, min)
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => reject(err))
        })
    }

} 