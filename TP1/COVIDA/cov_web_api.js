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
        if(!req.query.name) return rsp.status(422).send(`Invalid query syntax, please make sure query params are according to the documentation.`)
        covServices.searchGames(req.query.name, (err, games, status) => { 
            if(err == null) rsp.status(200).send(JSON.parse(games))
            else rsp.status(status).json(new Error(err.message, req.originalUrl))
        })
  }

  function createGroup(req, rsp){
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.createGroup(groupName, req.body.desc, (err, succ, status) => {
          if(err == null) sendSuccess(req, rsp, groupName, 'create', 201)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function editGroup(req, rsp){
      if(!req.body.newName && !req.body.newDesc) return rsp.status(422).send(`Invalid body syntax, please make sure body params are according to the documentation.`)
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.editGroup(groupName, req.body.newName, req.body.newDesc, (err, succ, status) => {
          if(err == null) rsp.status(200).send(`Group successfully edited to \n ${JSON.stringify(succ, null, "\t")}`)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
        })
  }

  function listGroups(req, rsp){
      covServices.listGroups((err, groups, status) => {
          if(err == null) rsp.status(200).json(groups)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })

  }

  function showGroup(req, rsp){
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.showGroup(groupName, (err, succ, status) => {
          if(err == null) rsp.status(200).json(succ)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function addToGroup(req, rsp){
      if(!req.body.gameID) return rsp.status(422).send(`Invalid body syntax - cannot find gameID - please make sure body params are according to the documentation.`)
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.addToGroup(req.body.gameID, groupName, (err, game, status) => {
          if(err == null) rsp.status(200).send(`Game ${game.name} successfully added to group ${groupName}`)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function removeFromGroup(req, rsp){
      if(!req.body.gameID) return rsp.status(422).send(`Invalid body syntax - cannot find gameID - please make sure body params are according to the documentation.`)
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.removeFromGroup(req.body.gameID, groupName, (err, game, status) => {
          if(err == null) rsp.status(200).send(`Game ${game.name} successfully removed from group ${groupName}`)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
    })
  }

  function getGamesBetween(req, rsp){
      if(req.body.min > req.body.max) return rsp.status(406).send(`${req.min} to ${req.max} is not a valid interval`)
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.getGamesBetween(groupName, req.body.max, req.body.min, (err, succ, status) => {
          if(err == null) rsp.status(200).json(succ)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function Error(msg, uri){
        this.error = msg
        this.uri = uri
  }

  function sendSuccess(req, rsp, group, changeType, statusCode){
      rsp.status(statusCode).json({
          status: `group ${group} ${changeType}d successfully.`,
          uri: req.originalUrl
      })
  }
}