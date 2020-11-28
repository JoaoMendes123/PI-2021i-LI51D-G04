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
      covServices.searchGames(req.body.search,)
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
      covServices.addToGroup(, req.params.id,)
  }

  function removeFromGroup(req, rsp){

  }

  function getGamesBetween(req, rsp){

  }

}


