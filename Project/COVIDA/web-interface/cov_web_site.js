'use strict'

const { response } = require('express')
const express = require('express')
module.exports = function (covServices) {
    if(!covServices) {
      throw "Invalid covServices object"
    }

    const router = express.Router()
    const bodyparser = require('body-parser')
    router.use(express.json())
    router.use(bodyparser.json())
    var methodOverride = require('method-override')
    router.use(methodOverride('_method'))

    router.get('/groups/new', createGroupPage)
    router.get('/groups/:groupId/edit', editGroupPage)
    router.get('/games/', searchGames)
    router.post('/groups/', createGroup)
    router.put('/groups/:groupId', editGroup)
    router.get('/groups/', listGroups)
    router.get('/groups/:groupId', (req,res) => {
        if(!Object.keys(req.query).length == 0) getGamesBetween(req, res)
        else showGroup(req, res)
    })
    router.post('/groups/:groupId', addToGroup)
    router.delete('/groups/:groupId', (req, res) => {
        if(!Object.keys(req.body).length == 0) removeFromGroup(req, res)
        else deleteGroup(req, res)
    })
    
    return router
    
    function editGroupPage(req, rsp){
    
    rsp.render('./views/editGroup', {title: 'Edit group'})
    }

    function createGroupPage(req, rsp){
        rsp.render('./views/createGroup', {title: 'Create a Group'})
    }

    async function searchGames(req, rsp){
        if(!req.query.name) return rsp.status(422).json(new Error(`Invalid query syntax, please make sure query params are according to the documentation.`, req.originalUrl))
        var games = await covServices.searchGames(req.query.name)
        var groups = await covServices.listGroups()
        console.log(groups)
        rsp.render('./views/searchView', {games: games, groups: groups})

    }

    function createGroup(req, rsp){
        if(!req.body.name) return rsp.status(400).json(new Error(`Invalid body syntax- Cannot find group name - Please make sure body params are according to the documentation.`, req.originalUrl))
        const groupName = req.body.name
        covServices.createGroup(groupName, req.body.desc)
            .then(succ => {
                //sendSuccess(req,rsp,new Answer(`Group sucessfully Created.`,succ),201))
                rsp.render('successAlert', {message: 'Group Successfully Created'})
            })
            .catch(err => console.log(err)/*rsp.status(err.status).json(new Error(err.message, req.originalUrl))*/)
    }
    function editGroup(req, rsp){
        if(!req.body.newName && !req.body.newDesc) return rsp.status(422).json(new Error(`Invalid body syntax, please make sure body params are according to the documentation.`, req.originalUrl))
        const groupId = req.params.groupId
        covServices.editGroup(groupId, req.body.newName, req.body.newDesc)
            .then(succ => {
                if(succ.result == 'noop') sendSuccess(req,rsp, new Answer(`Group was not modified`, succ.group), 200)
                else sendSuccess(req,rsp,new Answer(`Group sucessfully edited.`,succ.group),200)
            })
            .catch(err => rsp.status(err.status).json(new Error(err.message, req.originalUrl)))
    }

    function listGroups(req, rsp){
        covServices.listGroups()
            .then(groups => rsp.render('index', { title: 'Test', groups: groups}))
            .catch(err => console.log(err))
    }

    function showGroup(req, rsp){
        const groupId = req.params.groupId
        covServices.showGroup(groupId)
            .then(succ =>  rsp.render('groupView',{group: succ}))
            .catch(err => rsp.status(err.status).json(new Error(err.message, req.originalUrl)))
    }

    function deleteGroup(req, rsp){
        const groupID = req.params.groupId
        covServices.deleteGroup(groupID)
            .then(succ => rsp.render('successAlert',{message: 'Group successfully removed'}))
            .catch(err => rsp.status(err.status).json( new Error(err.message, req.originalUrl)))
    }

    function addToGroup(req, rsp){
        if(!req.body.gameID) return rsp.status(422).json(new Error(`Invalid body syntax - cannot find gameID - please make sure body params are according to the documentation.`, req.originalUrl))
        if(isNaN(req.body.gameID)) return rsp.status(422).json(new Error(`${req.body.gameID} is not a valid ID. ID's must consist only of numbers.`, req.originalUrl))
        const groupId = req.params.groupId
        covServices.addToGroup(req.body.gameID, groupId)
            .then(res => sendSuccess(req,rsp,new Answer(`Game ${res.game} successfully added to group ${res.group.name}`, res.group),200))
            .catch((err) => rsp.status(err.status).json(new Error(err.message, req.originalUrl)))
    }

    function removeFromGroup(req, rsp){
        if(!req.body.gameID) return rsp.status(422).json(new Error(`Invalid body syntax - cannot find gameID - please make sure body params are according to the documentation.`, req.originalUrl))
        if(isNaN(req.body.gameID)) return rsp.status(422).json(new Error(`${req.body.gameID} is not a valid ID. ID's must consist only of numbers.`,req.originalUrl))
        const groupId = req.params.groupId
        covServices.removeFromGroup(groupId, req.body.gameID)
            .then(res => sendSuccess(req,rsp,new Answer(`Game ${res.game} successfully removed from group ${res.group.name}`, res.group),200) )
            .catch(err => rsp.status(err.status).json(new Error(err.message, req.originalUrl)))
    }

    function getGamesBetween(req, rsp){
        const groupId = req.params.groupId
        covServices.getGamesBetween(groupId, req.query.maxRating, req.query.minRating)
            .then(succ => sendSuccess(req,rsp,new Answer('Games that fit interval:',succ),200))
            .catch(err => rsp.status(err.status).json(new Error(err.message, req.originalUrl)))
    }

    function Error(msg, uri){
        this.message = msg
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