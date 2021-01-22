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

    async function searchGames(req, rsp){
        var games = await covServices.searchGames(req.query.name)
        var groups = await covServices.listGroups()
        console.log(groups)
        console.log(games)
        rsp.render('searchView', {games: games, groups: groups})

    }

    function createGroup(req, rsp){
        const groupName = req.body.name
        covServices.createGroup(groupName, req.body.desc)
            .then(succ => {
                rsp.render('successAlert', {message: 'Group Successfully Created'})
            })
            .catch(err => rsp.status(err.status).json(new Error(err.message, req.originalUrl)))
    }
    function editGroup(req, rsp){
        const groupId = req.params.groupId
        covServices.editGroup(groupId, req.body.newName, req.body.newDesc)
            .then(succ => rsp.redirect('/site/groups/'))
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
        const groupId = req.params.groupId
        covServices.addToGroup(req.body.gameID, groupId)
            .then(res => rsp.redirect('/site/groups/'+groupId))
            .catch((err) => rsp.status(err.status).json(new Error(err.message, req.originalUrl)))
    }

    function removeFromGroup(req, rsp){
        const groupId = req.params.groupId
        covServices.removeFromGroup(groupId, req.body.gameID)
            .then(res => rsp.redirect('site/groups/'+groupId))
            .catch(err => rsp.status(err.status).json(new Error(err.message, req.originalUrl)))
    }

    function getGamesBetween(req, rsp){
        const groupId = req.params.groupId
        covServices.getGamesBetween(groupId, req.query.maxRating, req.query.minRating)
            .then(succ => rsp.render('groupView', {group: succ}))
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