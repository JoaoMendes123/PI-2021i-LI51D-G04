'use strict'
const fs = require('fs')
const GROUPS_PATH = 'groups.json'
    /**
     * 
     * @param {Name of the group being created} group_name 
     * @param {Description of the group being created} group_description 
     * @param {callback function} cb 
     */
    function createGroup(group_name,group_description,cb){
        fs.readFile(GROUPS_PATH, (err, buffer) => {
            if(err) return cb(new Error(`Cant read  ${err}`),null,500)
            let groups = buffer.length > 0 ? JSON.parse(buffer) : []
            if(groups.some(group => group.name === group_name))
                return cb(new Error(`Can't create new group with ${group_name} because one already exists `),null,409)
            let res = new Group(group_name,group_description,[])
            groups.push(res)
            fs.writeFile(GROUPS_PATH,JSON.stringify(groups,null,`\t`),err => {
                if(err) {return cb(new Error(`Error Writing: ${err}`),null,500)}
                cb(null,res)
            })
        })
    }
    /**
     * 
     * @param {Name of the group being affected} group_name 
     * @param {JSON-Object to add to group} game 
     * @param {callback function} cb 
     */
    function addToGroup(group_name,game,cb){
        fs.readFile(GROUPS_PATH, 'utf8', (err, buffer) => {
            if(err)return cb(new Error(`Cant read  ${err}`),500)
            if(buffer.length == 0) return cb(new Error(`There are no groups, create one first`),404)
            var groups = JSON.parse(buffer)
            if(!game.name) return cb(new Error(`No such game found, make sure the ID is correct`),406)
            if(groups.find(group => group.name === group_name)){
                groups.forEach(group => {  
                    if(group.name == group_name){
                        if(group.games.find(g => g.id == game.id)) return cb(new Error(`Can't add ${game.name} to group ${group_name} because it's already present`),409)
                        group = sorted_game_insertion(group, game)
                        fs.writeFile(GROUPS_PATH,JSON.stringify(groups,null,`\t`),err => {
                            if(err) return cb(new Error(`Error Writing: ${err}`),500)
                            return cb(null)
                        })
                    }
                })
            }else return cb(new Error(`Can't find group with name:${group_name}`),406)
        })
    }
    /**
     * Returns groups available to the callback function
     * @param {callback function} cb 
     */
    function listGroups(cb){
        fs.readFile(GROUPS_PATH, (err,buffer) => {
            if(err) return cb(new Error(`Cant read  ${err}`),null,500)
            if(buffer.length == 0) return cb(new Error(`There are no groups to be listed, create one first`),null,404)
            var groups = JSON.parse(buffer)
            cb(null,groups)
        })
    }
    /**
     * 
     * @param {Name of the group to be passed to callback function} group_name 
     * @param {callback function} cb 
     */
    function showGroup(group_name, cb){
        fs.readFile(GROUPS_PATH, (err,buffer) => {
            if(err) return cb(new Error(`Cant read  ${err}`),null,500)
            if(buffer.length == 0) return cb(new Error(`There are no groups to be shown, create one first`),null,404)
            var groups = JSON.parse(buffer)
            var targetGroup = groups.find(group => group.name === group_name)
            if(targetGroup) return cb(null,targetGroup)
            else cb(new Error(`Can't find group with name ${group_name}`),null,406)
        })
    }
    /**
     * 
     * @param {Name of the group to be edited} group_name 
     * @param {updated name, if undefined doens't update group's name} name_update 
     * @param {updated description, if undefined doesn't update group's name} description_update 
     * @param {callback function} cb 
     */
    function editGroup(group_name, name_update, description_update, cb){
        fs.readFile(GROUPS_PATH, (err, buffer) => {
            if(err) return cb(new Error(`Cant read  ${err}`),null,500)
            if(buffer.length == 0) return cb(new Error(`There are no groups to be edited, create one first`),null,404)
            var groups = JSON.parse(buffer)
            if(groups.find(g => g.name == name_update)) return cb(new Error(`Can't update group name to one that already exists`),null,409)
            let targetGroup = groups.findIndex(group => group.name === group_name)
            if(targetGroup != -1){
                groups[targetGroup].name = name_update? name_update : groups[targetGroup].name
                groups[targetGroup].description = description_update?  description_update : groups[targetGroup].description 
                fs.writeFile(GROUPS_PATH, JSON.stringify(groups,null,`\t`), (err) => {
                    if(err) return cb(new Error(`Error Writing: ${err}`),null,500)
                    let res = new Group(groups[targetGroup].name,groups[targetGroup].description)
                    cb(null,res)
                })
            }else return cb(new Error(`There is no group with name ${group_name}`),null,406)
        })
    }
    /**
     * 
     * @param {Name of the group to be affected} group_name 
     * @param {JSON-Object to remove from group} game 
     * @param {callback function} cb 
     */
    function removeFromGroup(group_name,game,cb){
        fs.readFile(GROUPS_PATH,(err,buffer)=>{
            if(err) return cb(new Error(`Cant read  ${err}`), 500)
            var groups = JSON.parse(buffer)
            if(buffer.length == 0) return cb(new Error(`There are no groups to remove, create one first`),404)
            if(groups.find(group => group.name = group_name)){
                groups.forEach(group => {
                    if(group.name == group_name){
                        let target_index = group.games.findIndex(g => g.name == game.name)
                        if(target_index == -1) return cb(new Error(`Couldn't find game ${game.name} in group ${group.name}`),409)
                        let game_removed = group.games.splice(target_index, 1)
                        fs.writeFile(GROUPS_PATH,JSON.stringify(groups,null,`\t`),err => {
                            if(err) {return cb(new Error(`Error Writing: ${err}`),500)}
                            cb(null,game_removed)
                        })
                    }
                })  
            }else return cb(new Error(`There is no group with name ${group_name}`),406)
        })
    }
    /**
     * 
     * @param {Name of the group to display} group_name 
     * @param {highest rating possible, passed to cb} high 
     * @param {lowest rating possible, passed to cb} low 
     * @param {callback function, returns games in interval} cb 
     */
    function getGamesBetween(group_name,high=100,low=0,cb){
        high = high == ""? 100 : high
        low = low == ""? 0 : low
        fs.readFile(GROUPS_PATH,(err,buffer) => {
            if(err) return cb(new Error(`Error reading: ${err}`),null,500)
            var groups = JSON.parse(buffer)
            if(groups.find(group => group.name == group_name)){
                groups.forEach(group => {
                    if(group.name == group_name && group.games.length != 0){
                        var res = group.games.filter(game => game.total_rating >= low && game.total_rating <= high)
                        if(res.length >= 1) return cb(null,res)
                        else return cb(new Error(`No games fit in given rating interval`),null,406)
                    }else if(group.name == group_name && group.games.length == 0) return cb(new Error(`Group ${group.name} doesn't have any games in it`),null,404)
                })
            }else return cb(new Error(`There is no group with name ${group_name}`),null,500)
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


    function Group(group_name, group_description = "", games) {
      this.name = group_name,
      this.description = group_description,
      this.games = games
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