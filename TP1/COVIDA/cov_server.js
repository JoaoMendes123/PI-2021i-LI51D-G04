//Dependencies
const bodyparser = require('body-parser')
const express = require('express')
const covDB = require('./cov_db')
const covServices = require('./cov_services')(covDB)
const covApi = require('./cov_web_api')(covServices)

//Constants
const PORT = 8000
const app = express()
app.use(express.json())
app.use(bodyparser.text())

app.get('/covida',checkAPI)
app.get('/covida/games/search', covApi.searchGames)
app.post('/covida/groups/create', covApi.createGroup)
app.put('/covida/groups/edit', covApi.editGroup)
app.get('/covida/groups/list', covApi.listGroups)
app.get('/covida/groups/show', covApi.showGroup)
app.post('/covida/groups/add', covApi.addToGroup)
app.delete('/covida/groups/remove', covApi.removeFromGroup)
app.get('/covida/groups/sort', covApi.getGamesBetween)

app.listen(PORT, () => {
    console.log("server is running...")
  })

function checkAPI(req,rsp){
  rsp.status(200).json({
    "name": "COVIDA",
    "version": "1.0.0",
    "description": "Create and manage groups of games"
  })
}