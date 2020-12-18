const GROUPS_PATH = 'groups.json'
const ES_URL =  `http://localhost:9200`
const { group } = require('console')
const fetch = require('node-fetch')
const { dbError,dbGroup,dbGame } = require('./resources.js')
/**
 * TODO:
 *  Handle Erros in available functions
 *  
 */
async function createGroup(group_name, group_description){
    var groups = await fetchGroups()
    console.log(groups.length)
    let _id = groups.length > 0 ? Math.max.apply(null, groups.map(group => group.id)) + 1 : 0
    let new_group = new dbGroup(_id,group_name,group_description,[])
    return fetch(ES_URL+`/groups/_doc/${_id}`,{
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            "group":  new_group
        })
    })
    .then(res => res.json())
    .then(res => {if(res.result == 'created')return new_group})
}
/**
 * deletes group from BD and returns removed group
 * @param {id of group to be deleted} group_id 
 */
async function deleteGroup(group_id){
    var groups = await fetchGroups()
    if(groups.length==0) throw new dbError(`There are no groups in DB`,404)
    let group_deleted = groups.find(group => group.id == group_id)
    return fetch(ES_URL+`/groups/_doc/${group_id}`,{
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        if(res.result == 'not_found') throw new dbError(`There is no group with id: ${group_id}`,404)
        if(res.result == 'deleted') return group_deleted
    })

}
/**
 * updates given group with a new game and returns group updated
 * @param {group to change} group_id 
 * @param {game to add} game 
 */
async function addToGroup(group_id,game){
    var groups = await fetchGroups()
    if(groups.length==0) throw new dbError(`There are no groups in DB`,404)
    let group_index = groups.findIndex(group => group.id == group_id)
    if(group_index !=-1){
        if(groups[group_index].games.find(g => g.id == game.id)) throw new dbError(`Game already in group `,404)
    }else throw new dbError(`Group given not found `,404)
    return fetch(ES_URL+`/groups/_update/${group_id}`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            "script": {
                "source": "ctx._source.group.games.add(params.tag)",
                "lang": "painless",
                "params": {
                  "tag": game
                }
              }
        })
    })
    .then(res => res.json())
    .then(res => {
        if(res.result == 'updated'){
            groups[group_index].games.push(game)
            return groups[group_index]
        }  
    })
    
}
/**
 * removes specific game from a specific group and returns name of group affected
 * @param {group to change} group_id 
 * @param {agme to remove} game_id 
 */
async function removeFromGroup(group_id, game_id){
    var groups = await fetchGroups()
    if(groups.length==0) throw new dbError(`There are no groups in DB`,404)
    let group_index = groups.findIndex(group => group.id == group_id)
    if(group_index !=-1){
        removedGame = groups[group_index].games.findIndex(g => g.id == game_id)
        if(removedGame != -1){
            return fetch(ES_URL+`/groups/_update/${group_id}`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    "script": {
                        "source": "ctx._source.group.games.remove(params.game)",
                        "lang": "painless",
                        "params": {
                            "game": removedGame
                          }
                      }
                })
            })
            .then(res => res.json())
            .then(res => {
                if(res.result == 'deleted') return groups[group_index].name
            })
            
        }else  throw new dbError('Game not in group',404)
    }else throw new dbError('Group given not found ',404)
}
/**
 * 
 * @param {group to be edited} group_id 
 * @param {update to name field} name_update can be null
 * @param {uptade to description field} description_update can be null
 */
async function editGroup(group_id, name_update, description_update){
    var groups = await fetchGroups()
    if(name_update)
    if(groups.length==0) throw new dbError(`There are no groups in DB`,404)
    let group_index =  groups.findIndex(group => group.id == group_id)
    if(group_index != -1){
        groups[group_index].name = name_update? name_update:groups[group_index].name
        groups[group_index].description = description_update?  description_update : groups[group_index].description
        return fetch(ES_URL+`/groups/_update/${group_id}`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "doc": {
                    "group" : groups[group_index]
                  }
            })
        })
        .then(res => res.json())
        
    }else throw new dbError("Group Not Found",404)
}
/**
 * returns all groups
 */
async function listGroups(){
    return await fetchGroups()
}
/**
 * return specified group
 * @param {group to be shown} group_id 
 */
async function showGroup(group_id){
    let groups = await fetchGroups()
    if(groups.length == 0) throw new dbError('No groups in DB',500)
    group_index = groups.findIndex(group => group.id == group_id)
    if(group_index != -1){
        return groups[group_index]
    }else throw new dbError('Group Not Found',404)

}
/**
 * returns the group with given id to cov_services
 * @param {group to be shown} group_id 
 */
async function getGamesBetween(group_id){
    return await showGroup(group_id)
}



module.exports = {
    createGroup: createGroup,
    deleteGroup:deleteGroup,
    addToGroup: addToGroup,
    removeFromGroup: removeFromGroup,
    listGroups: listGroups,
    showGroup: showGroup,
    editGroup: editGroup,
    getGamesBetween: getGamesBetween
}

function fetchGroups(){
    return fetch(ES_URL+`/groups/_search`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "from" : 0, "size" : 100
        })
    })
    .then(res => res.json())
    .then(res => {
        let a = res.hits.hits
        let aux = []
        for(var i = 0; i<a.length;i++){
            var g = new dbGroup(a[i]._id,a[i]._source.group.name,a[i]._source.group.description,a[i]._source.group.games)
            aux.push(g)
        }
        return aux
    })
}
//createGroup('oi','desck212').then(res => console.log(res)).catch(err => console.log(JSON.stringify(err)))
//deleteGroup(0).then(res =>console.log(res)).catch(err => console.log(err))
//fetchGroups().then(aux => console.log(JSON.stringify(aux,null,`\t`))).catch(err => console.log(err))
//addToGroup(2,new dbGame(6,'game_name')).then(res => console.log(JSON.stringify(res,null,`\t`))).catch(err => console.log(err))
//removeFromGroup(3,1273).then(aux => console.log(JSON.stringify(aux,null,`\t`))).catch(err => console.log(err))
//aux().then(res => console.log(res)).catch(err => console.log(err))
//editGroup(1,'updatedName',"updated descriptio2n").then(res => console.log(JSON.stringify(res,null,`\t`))).catch(err => console.log(err))
//listGroups().then(res => console.log(JSON.stringify(res,null,`\t`))).catch(err => console.log(err))
//showGroup(2).then(res => console.log(JSON.stringify(res,null,`\t`))).catch(err => console.log(err))