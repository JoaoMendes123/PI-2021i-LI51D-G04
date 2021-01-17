//Dependencies
const bodyparser = require('body-parser')
const express = require('express')
const sitemap = require('express-sitemap-html')
const path = require('path')
const covDB = require('./cov_db')
const covServices = require('./cov_services')(covDB)
const covApiRouter = require('./cov_web_api')(covServices)
const covSiteRouter = require('./cov_web_site')(covServices)

//Constants
const PORT = 8000
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.json())


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(function(err, req, rsp, next) {
  if(err instanceof SyntaxError && err.status === 400 && "body" in err) {
    rsp.status(400).json("Error parsing body, body is not a valid JSON object.")
  }else next()
})
app.get('/covida',checkAPI)
app.use('/covida', covApiRouter)
app.use('/site', covSiteRouter)

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