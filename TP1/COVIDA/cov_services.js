'use strict'
const igdb = require('./igdb-data')
const sampleDB = require('./sampleDB')
module.exports = function(sampleDB) { // module.exports = function(covDB) {
    if(!sampleDB) {  // if(!covDB) {
      throw "Invalid covDB object"
    }
    
    return{
        searchGames:searchGames,
        createGroup:createGroup,
        editGroup:editGroup,  
        listGroups:listGroups,
        showGroup:showGroup,
        deleteGroup: deleteGroup,
        addToGroup:addToGroup,
        removeFromGroup:removeFromGroup,
        getGamesBetween:getGamesBetween
    }


    function searchGames(str){
        return new Promise((resolve, reject) => {
            igdb.searchGames(str)
                .then(games => {
                    resolve(games)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
    
    function createGroup(name, desc){
        return new Promise((resolve, reject) => {
            sampleDB.createGroup(name, desc) //  covDB.createGroup(name, desc)
                .then(res => {
                    console.log(res)
                    resolve(res)})
                .catch(error => {
                    console.log(err)
                    reject(error)})
        })
    }
    
    function editGroup(groupID, name, desc){
        return new Promise((resolve, reject) => {
            sampleDB.editGroup(groupID, name, desc)
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
    }
    
    function listGroups(){
        return new Promise((resolve, reject) => {
            sampleDB.listGroups()
                .then(res => {
                    console.log(res)
                    resolve(res)})
                .catch(error => {
                    console.log(error)
                    reject(error)})
        })
    }
    
    function showGroup(groupID){
        return new Promise((resolve, reject) => {
            sampleDB.showGroup(groupID) 
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
    }

    function deleteGroup(groupID){
        return new Promise((resolve, reject) => {
            sampleDB.deleteGroup(groupID)
                .then(res => {
                    console.log(res)
                    resolve(res)})
                .catch(error => {
                    console.log(error)
                    reject(error)})
        })
    }
    
    function addToGroup(gameID, groupID){
        return new Promise((resolve, reject) => {
            igdb.getGame(gameID)
                .then((game) => {
                    sampleDB.addToGroup(groupID, game[0]) //covDB.addToGroup(groupID, game[0])
                        .then((group) => {
                            console.log(group)
                            resolve({
                                group: group,
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
                    sampleDB.removeFromGroup(groupID, game[0])
                        .then((g) => resolve(g))
                        .catch((err) => reject(err))
                    })
                .catch((err) => reject(err))    
        })
    }
    
    function getGamesBetween(groupID, max, min){
        return new Promise((resolve, reject) => {
            var array = []
            //var aux = []
            sampleDB.showGroup(groupID)
                .then(res => {
                    array = res.games
                })
                .catch((err) => reject(err))
        })
    }

    function sorted_game_insertion(array,game){
        if(array.length == 0){
           array.push(game);
        }else{
           array.push(game);
           for (let i = 1; i < array.length; i++) {
               let current = array[i];
               let j = i-1; 
               while ((j > -1) && (current.total_rating > array[j].total_rating || !array[j].total_rating )) {
                   array[j+1] = array[j];
                   j--;
               }
               array[j+1] = current;
           }
        }
        console.log('11')
        return array;
        }
} 