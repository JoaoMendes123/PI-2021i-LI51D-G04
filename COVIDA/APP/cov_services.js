'use strict'
const igdb = require('./data/igdb-data')
const { dbGame, dbError } = require('./resources')
module.exports = function (covDB, usersDB) {
    if (!covDB) {
        throw "Invalid covDB object"
    }
    if (!usersDB) {
        throw "Invalid usersDB object"
    }
    return {
        searchGames: searchGames,
        createGroup: createGroup,
        editGroup: editGroup,
        listGroups: listGroups,
        showGroup: showGroup,
        deleteGroup: deleteGroup,
        addToGroup: addToGroup,
        removeFromGroup: removeFromGroup,
        getGamesBetween: getGamesBetween,
        verifyLoginCredentials: verifyLoginCredentials,
        registerAccount: registerAccount
    }


    function searchGames(str) {
        return new Promise((resolve, reject) => {
            igdb.searchGames(str)
                .then(games => resolve(games))
                .catch(error => reject(error))
        })
    }

    function createGroup(name, desc, username) {
        return new Promise((resolve, reject) => {
            covDB.createGroup(name, desc, username)
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
    }

    function editGroup(groupID, name, desc) {
        return new Promise((resolve, reject) => {
            covDB.editGroup(groupID, name, desc)
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
    }

    function listGroups(user) {
        return new Promise((resolve, reject) => {
            covDB.listGroups(user)
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
    }

    function showGroup(groupID) {
        return new Promise((resolve, reject) => {
            covDB.showGroup(groupID)
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
    }

    function deleteGroup(groupID) {
        return new Promise((resolve, reject) => {
            covDB.deleteGroup(groupID)
                .then(res => resolve(res))
                .catch(error => reject(error))
        })
    }

    function addToGroup(gameID, groupID) {
        return new Promise((resolve, reject) => {
            igdb.getGame(gameID)
                .then((game) => {
                    var g = new dbGame(game[0].id, game[0].name)
                    covDB.addToGroup(groupID, g) //covDB.addToGroup(groupID, game[0])
                        .then((group) => {
                            resolve({
                                group: group,
                                game: g.name
                            })

                        })
                        .catch((err) => reject(err))
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    function removeFromGroup(groupID, gameID) {
        return new Promise((resolve, reject) => {
            igdb.getGame(gameID)
                .then((game) => {
                    var g = new dbGame(game[0].id, game[0].name)
                    covDB.removeFromGroup(groupID, g.id)
                        .then((group) => {
                            resolve({
                                group: group,
                                game: g.name
                            })
                        })
                        .catch((err) => reject(err))
                })
                .catch((err) => reject(err))
        })
    }

    async function getGamesBetween(groupID, max, min) {
        var array = []
        max = max == "" ? 100 : max
        min = min == "" ? 0 : min
        var group = await covDB.showGroup(groupID)
        array = await createSortedArray(group.games, max, min)
        group.games = array
        return group
    }

    async function createSortedArray(games, max, min) {
        var array = []
        const length = games.length
        for (var i = 0; i < games.length; i++) {
            let game = await igdb.getGame(games[i].id)
            if (game[0].total_rating >= min && game[0].total_rating <= max) {
                array = sorted_game_insertion(array, game[0])
            }
        }
        return array
    }

    function sorted_game_insertion(array, game) {
        if (array.length == 0) {
            array.push(game);
        } else {
            array.push(game);
            for (let i = 1; i < array.length; i++) {
                let current = array[i];
                let j = i - 1;
                while ((j > -1) && (current.total_rating > array[j].total_rating || !array[j].total_rating)) {
                    array[j + 1] = array[j];
                    j--;
                }
                array[j + 1] = current;
            }
        }
        return array;
    }

    function verifyLoginCredentials(credentials) {
        return new Promise((resolve, reject) => {
            usersDB.getUser(credentials.email)
                .then(user => {
                    let status = !user || user.password != credentials.password ?
                        { validCredentials: false, error: "Invalid user credentials" } :
                        { validCredentials: true }
                    resolve(status)
                })
                .catch((err) => reject(err))
        })
    }

    function registerAccount(credentials) {
        return new Promise((resolve, reject) => {
            usersDB.getUser(credentials.email)
                .then(res => reject(new dbError('Username already exists', 409)))
                .catch(err => {
                    resolve(usersDB.addUser(credentials))
                })
        })   
    }
} 