//Dependencies
var express        = require('express')

//Constants
const PORT = 8000
const TWITCH_CLIENT_ID = "ko2c8v3hhmzujhpitxqgigsdzg0ay0"
const TWITCH_CLIENT_SECRET = "x7pxjp119q2lkptgti88jq0ffc08gc"
const SESSION_SECRET;
const CALLBACK_URL = "http://localhost:3000/auth/twitch/callback"

const app = express()
const routes = require('./cov_web_api')
app.use(routes)

app.listen(PORT, () => {
    console.log("server is running...")
    if(process.send)
    process.send({ running: true })
  })