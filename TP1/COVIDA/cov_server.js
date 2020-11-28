//Dependencies
const express = require('express')
const covDB = require('./cov_db')()
const covServices = require('./cov_services')(covDB)
const covApi = require('./cov_web_api')(covServices)

//Constants
const PORT = 8000
const TWITCH_CLIENT_ID = "ko2c8v3hhmzujhpitxqgigsdzg0ay0"
const TWITCH_CLIENT_SECRET = "08k5wsc9g7znuwx9m1pvy5d7xw13lr"

const app = express()
app.use(express.json)
app.get('/',checkAPI(req,res))
app.get('/covida/games/search',cov_web_api)

app.listen(PORT, () => {
    console.log("server is running...")
    if(process.send)
    process.send({ running: true })
  })

function checkAPI(req,res){
  console.log(req);
  res.send('its working i think')
}