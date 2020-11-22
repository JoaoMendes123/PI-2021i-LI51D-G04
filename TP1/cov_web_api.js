
const services = require('./cov_services')

module.exports = {
    getPopularGames: getPopularGames,
    searchGames: searchGames,
    createGroup: createGroup,
    editGroup: editGroup,
    listGroups: listGroups,
    showGroup: showGroup,
    addToGroup: addToGroup,
    removeFromGroup: removeFromGroup,
    getGamesBetween: getGamesBetween,
}

getPopularGames(req, rsp){
    services.getPopularGames(games = rsp.json(games))
}

searchGames(req, rsp){

}