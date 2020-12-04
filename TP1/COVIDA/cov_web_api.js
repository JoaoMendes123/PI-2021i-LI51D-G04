'use strict'

const { query } = require("express")
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
        if(!req.query.name) {
            rsp.status(400).send(`Invalid query syntax, please make sure query params are according to the documentation.`)
            return
        }
        covServices.searchGames(req.query.name, (err, games, status) => { 
            if(err == null) rsp.status(200).send(JSON.parse(games))
            else rsp.status(status).json(new Error(err.message, req.originalUrl))
        })
  }

  function createGroup(req, rsp){
      const body = bodyParser(req, rsp)
      if(!body) return
      if(!body.groupName){
        rsp.status(400).send(`Cannot reach groupName, please make sure body syntax is according to documentation.`)
        return
      }
      covServices.createGroup(body.groupName, body.desc, (err, succ, status) => {
          if(err == null) sendSuccess(req, rsp, body.groupName, 'create', 201)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function editGroup(req, rsp){
      const body = bodyParser(req, rsp)
      if(!body) return
      if(!body.groupName){
        rsp.status(400).send(`Cannot reach groupName, please make sure body syntax is according to documentation.`)
        return
      } 
      covServices.editGroup(body.groupName, body.newName, body.newDesc, (err, succ, status) => {
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
      const body = bodyParser(req, rsp)
      if(!body) return
      if(!body.groupName) {
          rsp.status(400).send(`Cannot reach groupName, please make sure body syntax is according to documentation.`)
          return
      }
      covServices.showGroup(body.groupName, (err, succ, status) => {
          if(err == null) rsp.status(200).json(succ)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function addToGroup(req, rsp){
      const body = bodyParser(req, rsp)
      if(!body) return
      if(!body.groupName || !body.gameID){
        rsp.status(400).send(`Cannot reach groupName or gameID, please make sure body syntax is according to documentation.`)
        return
      }
      covServices.addToGroup(body.gameID, body.groupName, (err, game, status) => {
          if(err == null) rsp.status(200).send(`Game ${game.name} successfully added to group ${body.groupName}`)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
      })
  }

  function removeFromGroup(req, rsp){
      const body = bodyParser(req, rsp)
      if(!body) return
      if(!body.groupName || !body.gameID){
         rsp.status(400).send(`Cannot reach groupName or gameID, please make sure body syntax is according to documentation.`)
         return
      }
      covServices.removeFromGroup(body.gameID, body.groupName, (err, game, status) => {
          if(err == null) rsp.status(200).send(`Game ${game.name} successfully removed from group ${body.group}`)
          else rsp.status(status).json(new Error(err.message, req.originalUrl))
    })
  }

  function getGamesBetween(req, rsp){
      const body = bodyParser(req, rsp)
      if(!body) return
      if(!body.groupName){
        rsp.status(400).send(`Cannot reach groupName, please make sure body syntax is according to documentation.`)
        return
      }
      covServices.getGamesBetween(body.groupName, body.max, body.min, (err, succ, status) => {
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
  function bodyParser(req, rsp, cb){
    try{
        const body = JSON.parse("{"+req.body+"}")
        return body
    }catch(err){
        rsp.status(400).send(`Error parsing body, please check if body syntax is according to the documentation examples.`)
  }
}
}