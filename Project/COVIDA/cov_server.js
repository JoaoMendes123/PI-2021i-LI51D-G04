//Dependencies
const bodyparser = require('body-parser')
const express = require('express')
const sitemap = require('express-sitemap-html')
const path = require('path')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const expressSession = require('express-session')

const covDB = require('./cov_db')
const usersDB = require('./user_db')()
const covServices = require('./cov_services')(covDB,usersDB)
const covApiRouter = require('./web-interface/cov_web_api')(covServices)
const covSiteRouter = require('./web-interface/cov_web_site')(covServices)
const usersSiteRouter = require('./web-interface/users_web_site')(covServices)

//Constants
const PORT = 8000
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.json())

app.use(expressSession({secret: "its our secret boyy"}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, 'web-interface', 'public')));



app.set('views', path.join(__dirname,'web-interface', 'views'))
app.set('view engine', 'hbs')

app.use(function(err, req, rsp, next) {
  if(err instanceof SyntaxError && err.status === 400 && "body" in err) {
    rsp.status(400).json("Error parsing body, body is not a valid JSON object.")
  }else next()
})
app.get('/covida',checkAPI)
app.use('/covida', covApiRouter)
app.use('/site',verifyAuthenticated,covSiteRouter)
app.use('/users', usersSiteRouter)

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

function serializeUser(user,done){
  console.log(`UserSerialized: ${user.username}`)
  done(null, {username: user.username})
}
function deserializeUser(user,done){
 console.log(`UserDeserialized: ${user.username}`)
 done(null,user)
}

function verifyAuthenticated(req, rsp, next) {
  if(req.user) {
    return next()
  }
  rsp.redirect(302, '/users/login')
  // rsp.status(302).set('Location', '/site/public/login').end()
  // rsp.status(302).location('/site/public/login').end()
}