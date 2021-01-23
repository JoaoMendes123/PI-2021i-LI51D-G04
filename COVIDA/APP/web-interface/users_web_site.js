const express = require("express");

module.exports = function (covServices) {
  if (!covServices) {
    throw "Invalid covServices object";
  }

  const router = express.Router();

  router.get("/login", loginGet);
  router.post("/login", loginPost);
  router.get("/logout", logout);
  router.get("/register", registerGet)
  router.post("/register", registerPost)

  return router

  function loginGet(req, rsp) {
    rsp.render('login')
  }

  function loginPost(req, rsp) {
    const credentials = req.body

    covServices.verifyLoginCredentials(credentials)
      .then(status => {
        if (status.validCredentials) {
          req.login({ username: credentials.email }, (err) => rsp.redirect('/site/groups'))
        } else {
          rsp.render('login', { warning: "Incorrect password", username: credentials.email })
        }
      }).catch(err => rsp.render('login', { warning: "Incorrect e-mail"}))
  }

  function logout(req, rsp) {
    req.logout()
    rsp.redirect('/users/login')
  }

  function registerGet(req, rsp) {
    rsp.render('register')
  }
  
  function registerPost(req, rsp) {
    const credentials = req.body
    covServices.registerAccount(credentials)
      .then(res => {
        console.log(res)
        if(res === 'registered') rsp.redirect('/users/login')
      })
      .catch(err => console.log())
  }
}