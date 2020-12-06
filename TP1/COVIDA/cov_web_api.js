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
            if(err == null) sendSuccess(req,rsp,new Answer(`Displaying search results`,JSON.parse(games)),200)
            else rsp.status(status).json(new Error(err.message, req.originalUrl))
        })
  }

  function createGroup(req, rsp){
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.createGroup(groupName, req.body.desc, (err, succ, status) => {
          if(err == null) sendSuccess(req,rsp,new Answer(`Group sucessfully Created.`,succ),201)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }
  function editGroup(req, rsp){
      if(!req.body.newName && !req.body.newDesc) return rsp.status(422).send(`Invalid body syntax, please make sure body params are according to the documentation.`)
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.editGroup(groupName, req.body.newName, req.body.newDesc, (err, succ, status) => {
          if(err == null) sendSuccess(req,rsp,new Answer(`Group sucessfully edited.`,succ),200)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
        })
    }

  function listGroups(req, rsp){
      covServices.listGroups((err, groups, status) => {
          if(err == null) sendSuccess(req,rsp,new Answer(`Listing all groups`, groups),200)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })

  }

  function showGroup(req, rsp){
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.showGroup(groupName, (err, succ, status) => {
          if(err == null) sendSuccess(req,rsp,new Answer(`Displaying group ${succ.name}`, succ),200)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function addToGroup(req, rsp){
      if(!req.body.gameID) return rsp.status(422).send(`Invalid body syntax - cannot find gameID - please make sure body params are according to the documentation.`)
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.addToGroup(req.body.gameID, groupName, (err, game, status) => {
          if(err == null) sendSuccess(req,rsp,new Answer(`Game ${game.name} successfully added to group ${groupName}`, game),200)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function removeFromGroup(req, rsp){
      if(!req.body.gameID) return rsp.status(422).send(`Invalid body syntax - cannot find gameID - please make sure body params are according to the documentation.`)
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.removeFromGroup(req.body.gameID, groupName, (err, game, status) => {
          if(err == null) sendSuccess(req,rsp,new Answer("Game successfully removed", game),200)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
    })
  }

  function getGamesBetween(req, rsp){
      if(req.body.min > req.body.max) return rsp.status(406).send(`${req.min} to ${req.max} is not a valid interval`)
      const groupName = req.params.groupName.split("+").join(" ")
      covServices.getGamesBetween(groupName, req.body.max, req.body.min, (err, succ, status) => {
          if(err == null) sendSuccess(req,rsp,new Answer('Games that fit interval:',succ),200)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function Error(msg, uri){
        this.error = msg
        this.uri = uri
  }
  function Answer(msg, res){
    this.message = msg,
    this.result = res
}


  function sendSuccess(req, rsp, ans, statusCode){
      rsp.status(statusCode).json({
          status: ans,
          uri: req.originalUrl
          
      })
  }
}