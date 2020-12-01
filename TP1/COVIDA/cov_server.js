//Dependencies
const express = require('express')
const covDB = require('./cov_db')()
const covServices = require('./cov_services')(covDB)
const covApi = require('./cov_web_api')(covServices)

//Constants
const PORT = 8000
const app = express()
app.use(express.json())
app.get('/',checkAPI)

app.get('/covida/games/search/', covApi.searchGames)
app.post('/covida/groups', covApi.createGroup)
app.put('/covida/groups/:id', covApi.editGroup)
app.get('/covida/groups', covApi.listGroups)
app.get('/covida/groups/:id', covApi.showGroup)
app.post('/covida/groups/:id', covApi.addToGroup)

app.listen(PORT, () => {
    console.log("server is running...")
  })

function checkAPI(req,rsp){
  console.log(req.path);
  rsp.status(200).json({
    "name": "COVIDA",
    "version": "1.0.0",
    "description": "Create and manage groups of games"
  })
}