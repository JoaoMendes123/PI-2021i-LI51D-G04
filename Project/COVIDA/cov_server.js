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
app.use(bodyparser.json())

app.use(function(err, req, rsp, next) {
  if(err instanceof SyntaxError && err.status === 400 && "body" in err) {
    rsp.status(400).json("Error parsing body, body is not a valid JSON object.")
  }else next()
})

app.get('/covida',checkAPI)
app.get('/covida/games/', covApi.searchGames)
app.post('/covida/groups/', covApi.createGroup)//TO DO body request name
app.put('/covida/groups/:groupId', covApi.editGroup)
app.get('/covida/groups/', covApi.listGroups)
app.get('/covida/groups/:groupId', (req,res) => {
  if(req.query.minRating || req.query.maxRating) covApi.getGamesBetween(req, res)
  else covApi.showGroup(req, res)
})
app.post('/covida/groups/:groupId', covApi.addToGroup)
app.delete('/covida/groups/:groupId', (req, res) => {
  if(req.body.length > 0) covApi.removeFromGroup(req, res)
  else covApi.deleteGroup(req, res)
})

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