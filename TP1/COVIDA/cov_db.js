'use strict'
const fs = require('fs')
const resources = require('./resources.js')
const GROUPS_PATH = 'groups.json'
    /**
     * 
     * @param {Id of the group being created} group_id 
     * @param {Description of the group being created} group_description 
     */
    function createGroup(group_name,group_description){
        return new Promise((promise,reject) =>{
            fs.readFile(GROUPS_PATH, (err, buffer) => {
                if(err)return reject(new resources.dbError(`Cant read  ${err}`,500))
                let groups = buffer.length > 0 ? JSON.parse(buffer) : []
                let nextId = groups.length > 0 ? Math.max.apply(null, groups.map(group => group.id)) + 1 : 0
                let res = new resources.dbGroup(nextId,group_name,group_description,[])
                groups.push(res)
                fs.writeFile(GROUPS_PATH,JSON.stringify(groups,null,`\t`),err => {
                    if(err) return reject(new resources.dbError(`Error Writing: ${err}`,500))
                    else promise(res)
                })
            })
        })   
    }
    /**
     * 
     * @param {Id of the group being affected} group_id
     * @param {JSON-Object to add to group} game 
     */
    function addToGroup(group_id,game){
        return new Promise((promise, reject) => {
            fs.readFile(GROUPS_PATH, 'utf8', (err, buffer) => {
                if(err) return reject(new resources.dbError(`Cant read  ${err}`,500))
                if(buffer.length == 0) return reject(new resources.dbError(`There are no groups, create one first`,404))
                var groups = JSON.parse(buffer)
                if(!game.name) return reject(new resources.dbError(`No such game found, make sure the ID is correct`,406))//dont know if i need this here
                if(groups.find(group => group.id == group_id)){
                    groups.forEach(group => {  
                        if(group.id == group_id){
                            if(group.games.find(g => g.id == game.id)) return reject(new resources.dbError(`Can't add ${game.name} to group ${group.name} because it's already present`,409))
                            group = sorted_game_insertion(group, game)
                            fs.writeFile(GROUPS_PATH,JSON.stringify(groups,null,`\t`),err => {
                                if(err) return reject(new resources.dbError(`Error Writing: ${err}`,500))
                                else promise(group)
                            })
                        }
                    })
                }else return reject(new resources.dbError(`Can't find group with id:${group_id}`,404))
            })
        })
    }
    /**
     * Returns groups available to the callback function
     */
    function listGroups(){
        return new Promise((promise,reject) => {
            fs.readFile(GROUPS_PATH, (err,buffer) => {
                if(err) return reject(new resources.dbError(`Cant read  ${err}`,500))
                if(buffer.length == 0) return reject(new resources.dbError(`There are no groups to be listed, create one first`,404))
                var groups = JSON.parse(buffer)
                promise(groups)
            })
        })
    }
    /**
     * 
     * @param {Id of the group to be passed to callback function} group_id 
     */
    function showGroup(group_id){
        return new Promise((promise,reject)=>{
            fs.readFile(GROUPS_PATH, (err,buffer) => {
                if(err) return reject(new resources.dbError(`Cant read  ${err}`,500))
                if(buffer.length == 0) return reject(new resources.dbError(`There are no groups to be shown, create one first`,404))
                var groups = JSON.parse(buffer)
                var targetGroup = groups.find(group => group.id == group_id)
                if(targetGroup) return promise(targetGroup)
                else return reject(new resources.dbError(`Can't find group with name id:${group_id}`,404))
            })
        }) 
    }
    /**
     * 
     * @param {Id of the group to be edited} group_id 
     * @param {updated name, if undefined doens't update group's name} name_update 
     * @param {updated description, if undefined doesn't update group's name} description_update 
     */
    function editGroup(group_id, name_update, description_update){
        return new Promise((promise,reject) =>{
            fs.readFile(GROUPS_PATH, (err, buffer) => {
                if(err) return reject(new resources.dbError(`Cant read  ${err}`,500))
                if(buffer.length == 0) return reject(new resources.dbError(`There are no groups to be edited, create one first`,404))
                var groups = JSON.parse(buffer)
                let targetGroup = groups.findIndex(group => group.id == group_id)
                if(targetGroup != -1){
                    groups[targetGroup].name = name_update? name_update : groups[targetGroup].name
                    groups[targetGroup].description = description_update?  description_update : groups[targetGroup].description 
                    fs.writeFile(GROUPS_PATH, JSON.stringify(groups,null,`\t`), (err) => {
                        if(err) return reject(new resources.dbError(`Error Writing: ${err}`,500))
                        //Group with no games to display to user
                        else return promise(new resources.dbGroup(groups[targetGroup].id,groups[targetGroup].name,groups[targetGroup].description))
                    })
                }else return reject(new resources.dbError(`There is no group with id: ${group_id}`,404))
            })
        })
    }
    /**
     * 
     * @param {id of the group to be affected} group_id
     * @param {JSON-Object to remove from group} game 
     */
    function removeFromGroup(group_id,game){
        return new Promise((promise,reject) =>{
            fs.readFile(GROUPS_PATH,(err,buffer)=>{
                if(err) return reject(new resources.dbError(`Cant read  ${err}`, 500))
                var groups = JSON.parse(buffer)
                if(buffer.length == 0) return reject(new resources.dbError(`There are no groups to remove, create one first`,404))
                if(groups.find(group => group.id == group_id)){
                    groups.forEach(group => {
                        if(group.id == group_id){
                            let target_index = group.games.findIndex(g => g.id == game.id)
                            if(target_index == -1)return reject(new resources.dbError(`Couldn't find game ${game.name} in group ${group.name}`,409))
                            let game_removed = group.games.splice(target_index, 1)
                            fs.writeFile(GROUPS_PATH,JSON.stringify(groups,null,`\t`),err => {
                                if(err) return reject(new resources.dbError(`Error Writing: ${err}`,500))
                                return promise(game_removed)
                            })
                        }
                    })  
                }else return reject(new resources.dbError(`There is no group with id: ${group_id}`,404))
            })
        }) 
    }
    /**
     * @param {id of the group to display} group_id 
     * @param {highest rating possible, passed to cb} high 
     * @param {lowest rating possible, passed to cb} low 
     */
    function getGamesBetween(group_id,high=100,low=0){
        high = high == ""? 100 : high
        low = low == ""? 0 : low
        return new Promise((promise,reject) =>{
            fs.readFile(GROUPS_PATH,(err,buffer) => {
                if(err) return reject(new resources.dbError(`Error reading: ${err}`,500))
                var groups = JSON.parse(buffer)
                if(buffer.length == 0) return reject(new resources.dbError(`There are no groups to display, create one first`,404))
                if(low > high) return reject(new resources.Error(`${low} to ${high} is not a valid interval`, 406))                
                if(groups.find(group => group.id == group_id)){
                    groups.forEach(group => {
                        if(group.id == group_id && group.games.length != 0){
                            var res = group.games.filter(game => game.total_rating >= low && game.total_rating <= high)
                            if(res.length >= 1) return promise(res)
                            else return reject(new resources.dbError(`No games fit in given rating interval`,406))
                        }else if(group.id == group_id && group.games.length == 0) return reject(new resources.dbError(`Group ${group.name} doesn't have any games in it`,404))
                    })
                }else return reject(new resources.dbError(`There is no group with id: ${group_id}`,500))
            })
        })    
    }
    module.exports = {
         createGroup: createGroup,
         addToGroup: addToGroup,
         listGroups: listGroups,
         showGroup: showGroup,
         editGroup: editGroup,
         removeFromGroup: removeFromGroup,
         getGamesBetween: getGamesBetween
     }

/**
 * Inserts game in a way to remain in a descending order by rating
 * @param {*} game 
 * @param {*} group 
 */
function sorted_game_insertion(group,game){
    if(group.games.length == 0){
        group.games.push(game);
    }else{
        group.games.push(game);
        for (let i = 1; i < group.games.length; i++) {
            let current = group.games[i];
            let j = i-1; 
            while ((j > -1) && (current.total_rating > group.games[j].total_rating || !group.games[j].total_rating )) {
                group.games[j+1] = group.games[j];
                j--;
            }
            group.games[j+1] = current;
        }
    }
    return group;
}