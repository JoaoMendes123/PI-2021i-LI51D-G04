'use strict'
module.exports = function (covServices) {
    if(!covServices) {
      throw "Invalid covServices object"
    }
    return{
        searchGames: searchGames,
        createGroup: createGroup,
        editGroup: editGroup,
        listGroups: listGroups,
        showGroup: showGroup,
        addToGroup: addToGroup,
        removeFromGroup: removeFromGroup,
        getGamesBetween: getGamesBetween
    }
    
    function searchGames(req, rsp){
        console.log("web_api")
        console.log(req.query.name)
        covServices.searchGames(req.query.name, games => { 
            rsp.send(JSON.parse(games)); 
        })
  }

  function createGroup(req, rsp){
      
  }

  function editGroup(req, rsp){

  }

  function listGroups(req, rsp){
      covServices.listGroups(groups => rsp.json(groups))

  }

  function showGroup(req, rsp){
      covServices.showGroup(req.params.id, processShowGroup)
      function processShowGroup(err, group){
          if(err){
              sendNotFound(req, rsp)
          }
          rsp.json(group)
      }
  }

  function addToGroup(req, rsp){
      const body = JSON.parse("{"+req.body+"}")
      covServices.addToGroup(body.gameID, body.group, )
  }

  function removeFromGroup(req, rsp){
    const body = JSON.parse("{"+req.body+"}")
    covServices.removeFromGroup(body.gameID, body.group)
  }

  function getGamesBetween(req, rsp){

  }

}


