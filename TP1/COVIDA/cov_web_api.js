'use strict'

const { isBuffer } = require("util")

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
        covServices.searchGames(req.query.name, (err, games) => { 
            if(err == null) rsp.send(JSON.parse(games))
            else rsp.json(new Error(err.message, req.originalUrl))
        })
  }

  function createGroup(req, rsp){
      const body = JSON.parse("{"+req.body+"}")
      covServices.createGroup(body.name, body.desc, (err, succ) => {
          if(err == null) sendSuccess(req, rsp, body.name, 'create', body.name)
          else rsp.json(new Error(err.message, req.originalUrl))
      })
  }

  function editGroup(req, rsp){
        const body = JSON.parse("{"+req.body+"}")
        covServices.editGroup(body.group, body.newName, body.newDesc, (err, succ) => {
            if(err == null) //sendSuccess(req, rsp, body.group, 'update') send old name/old desc + new name/new desc
            else rsp.json(new Error(err.message, req.originalUrl))
        })
  }

  function listGroups(req, rsp){
      covServices.listGroups((err, groups) => {
          if(err == null) rsp.json(groups)
          else rsp.json(new Error(err.message, req.originalUrl))
      })

  }

  function showGroup(req, rsp){
    const body = JSON.parse("{"+req.body+"}")
      covServices.showGroup(body.name, (err, succ) => {
          if(err == null) rsp.json(succ)
          else rsp.json(new Error(err.message, req.originalUrl))
      })
  }

  function addToGroup(req, rsp){
      const body = JSON.parse("{"+req.body+"}")
      covServices.addToGroup(body.gameID, body.group, (err, succ) => {
          if(err == null) rsp.json(succ.message)
          else rsp.json(new Error(err.message, req.originalUrl))
      })
  }

  function removeFromGroup(req, rsp){
    const body = JSON.parse("{"+req.body+"}")
    //covServices.removeFromGroup(body.gameID, body.group)
  }

  function getGamesBetween(req, rsp){

  }

  function Error(msg, uri){
        this.error = msg
        this.uri = uri
  }

  function sendSuccess(req, rsp, group, changeType, suffix = ""){
      rsp.json({
          status: `group ${group} ${changeType}d successfully.`,
          uri: req.originalUrl + suffix
      })
  }

}


