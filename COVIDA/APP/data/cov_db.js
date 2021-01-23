const ES_URL = `http://localhost:9200`
const ES_IDX = `/groups`
const fetch = require('node-fetch')
const { dbError, dbGroup, dbGame } = require('../resources.js')
/**
 * TODO:
 *  Handle Erros in available functions
 *  
 * changes:
 *  Now it refreshes everytime u mess with the db for extra reliability
 */
async function createGroup(group_name, group_description, username, idx = ES_IDX) {
    if (!group_name) throw new dbError(`No group name given`, 404)
    var groups = await fetchGroups(idx).catch(err => { throw new dbError('Could not retrieve Groups information, please try again later', 502) })
    let _id = groups.length > 0 ? Math.max.apply(null, groups.map(group => group.id)) + 1 : 0
    let new_group = new dbGroup(_id, group_name, group_description, [], username)
    return fetch(ES_URL + idx + `/_doc/${_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "group": new_group
        })
    })
        .then(res => {
            refreshDB(idx)
            return res.json()
        })
        .then(res => { if (res.result == 'created') return new_group })
}
/**
 * deletes group from BD and returns removed group
 * @param {id of group to be deleted} group_id 
 */
async function deleteGroup(group_id, idx = ES_IDX) {
    var groups = await fetchGroups(idx).catch(err => { throw new dbError('Could not retrieve Groups information, please try again later', 502) })
    if (groups.length == 0) throw new dbError(`There are no groups in DB`, 404)
    let group_deleted = groups.find(group => group.id == group_id)
    return fetch(ES_URL + idx + `/_doc/${group_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            refreshDB()
            return res.json()
        })
        .then(res => {
            if (res.result === 'not_found') throw new dbError(`There is no group with id: ${group_id}`, 404)
            else if (res.result === 'deleted') return group_deleted
        })

}
/**
 * updates given group with a new game and returns group updated
 * @param {group to change} group_id 
 * @param {game to add} game 
 */
async function addToGroup(group_id, game, idx = ES_IDX) {
    var groups = await fetchGroups(idx).catch(err => { throw new dbError('Could not retrieve Groups information, please try again later', 502) })
    if (groups.length == 0) throw new dbError(`There are no groups in DB`, 404)
    let group_index = groups.findIndex(group => group.id == group_id)
    if (group_index != -1) {
        if (groups[group_index].games.find(g => g.id == game.id)) throw new dbError(`Game already in group`, 409)
    } else throw new dbError(`Group given not found `, 404)
    return fetch(ES_URL + idx + `/_update/${group_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "script": {
                "source": "ctx._source.group.games.add(params.tag)",
                "lang": "painless",
                "params": {
                    "tag": game
                }
            }
        })
    })
        .then(res => {
            refreshDB(idx)
            return res.json()
        })
        .then(res => {
            if (res.result == 'updated') {
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
async function removeFromGroup(group_id, game_id, idx = ES_IDX) {
    var groups = await fetchGroups(idx).catch(err => { throw new dbError('Could not retrieve Groups information, please try again later', 502) })
    if (groups.length == 0) throw new dbError(`There are no groups in DB`, 404)
    let group_index = groups.findIndex(group => group.id == group_id)
    if (group_index != -1) {
        const gameIndex = groups[group_index].games.findIndex(g => g.id == game_id)
        if (gameIndex != -1) {
            var group = groups[group_index]
            group.games.splice(gameIndex, 1)
            return fetch(ES_URL + idx + `/_doc/${group_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'group': {
                        'name': group.name,
                        'id': group.id,
                        'description': group.description,
                        'games': group.games,
                        'username': group.username
                    }
                })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.result == 'updated') return groups[group_index]
                })

        } else throw new dbError('Game not in group', 409)
    } else throw new dbError('Group given not found ', 404)
}
/**
 * 
 * @param {group to be edited} group_id 
 * @param {update to name field} name_update can be null
 * @param {uptade to description field} description_update can be null
 */
async function editGroup(group_id, name_update, description_update, idx = ES_IDX) {
    var groups = await fetchGroups(idx).catch(err => { throw new dbError('Could not retrieve Groups information, please try again later', 502) })
    if (groups.length == 0) throw new dbError(`There are no groups in DB`, 404)
    let group_index = groups.findIndex(group => group.id == group_id)
    if (group_index != -1) {
        groups[group_index].name = name_update ? name_update : groups[group_index].name
        groups[group_index].description = description_update ? description_update : groups[group_index].description
        return fetch(ES_URL + idx + `/_update/${group_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "doc": {
                    "group": groups[group_index]
                }
            })
        })
            .then(res => res.json())
            .then(res => {
                refreshDB(idx)
                return {
                    group: {
                        id: groups[group_index].id,
                        name: groups[group_index].name,
                        description: groups[group_index].description
                    },
                    result: res.result
                }
            })
    } else throw new dbError("Group Not Found", 404)
}
/**
 * returns all groups
 */
async function listGroups(user, idx = ES_IDX) {
    var groups = await fetchGroups(idx).catch(err => { throw new dbError('Could not retrieve Groups information, please try again later', 502) })
    groups = groups.filter(group => group.username == user)
    console.log(groups)
    var newGroups = groups.map(group => {
        return {
            id: group.id,
            name: group.name,
            description: group.description
        }
    })
    return newGroups
}
/**
 * return specified group
 * @param {group to be shown} group_id 
 */
async function showGroup(group_id, idx = ES_IDX) {
    let groups = await fetchGroups(idx).catch(err => { throw new dbError('Could not retrieve Groups information, please try again later', 502) })
    if (groups.length == 0) throw new dbError('No groups in DB', 404)
    group_index = groups.findIndex(group => group.id == group_id)
    if (group_index != -1) {
        return groups[group_index]
    } else throw new dbError('Group Not Found', 404)
}
module.exports = {
    createGroup: createGroup,
    deleteGroup: deleteGroup,
    addToGroup: addToGroup,
    removeFromGroup: removeFromGroup,
    listGroups: listGroups,
    showGroup: showGroup,
    editGroup: editGroup,
}

function fetchGroups(idx) {
    return fetch(ES_URL + idx + `/_search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "from": 0, "size": 100
        })
    })
        .then(res => res.json())
        .then(res => {
            let a = res.hits.hits
            let aux = []
            for (var i = 0; i < a.length; i++) {
                var g = new dbGroup(a[i]._id, a[i]._source.group.name, a[i]._source.group.description, a[i]._source.group.games, a[i]._source.group.username)
                aux.push(g)
            }
            return aux
        })
}
function refreshDB(idx) {
    return fetch(ES_URL + idx + `/_refresh`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

(function init() {
    return fetch(ES_URL + ES_IDX + `/_search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "from": 0, "size": 100
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.status == 404) {
                fetch(ES_URL + ES_IDX, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(console.log(`${ES_IDX} index created`))
            } else return
        })
})();
//createGroup('oi','desck212').then(res => console.log(res)).catch(err => console.log(JSON.stringify(err)))
//deleteGroup(0, "/test").then(res =>console.log(res)).catch(err => console.log(err))
//fetchGroups().then(aux => console.log(JSON.stringify(aux,null,`\t`))).catch(err => console.log(err))
//addToGroup(2,new dbGame(6,'game_name')).then(res => console.log(JSON.stringify(res,null,`\t`))).catch(err => console.log(err))
//removeFromGroup(3,1273).then(aux => console.log(JSON.stringify(aux,null,`\t`))).catch(err => console.log(err))
//aux().then(res => console.log(res)).catch(err => console.log(err))
//editGroup(1,'updatedName',"updated descriptio2n").then(res => console.log(JSON.stringify(res,null,`\t`))).catch(err => console.log(err))
//listGroups().then(res => console.log(JSON.stringify(res,null,`\t`))).catch(err => console.log(err))
//showGroup(2).then(res => console.log(JSON.stringify(res,null,`\t`))).catch(err => console.log(err))

