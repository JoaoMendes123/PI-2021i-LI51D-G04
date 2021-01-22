const express = require("express");

module.exports = function (covServices) {
  if (!covServices) {
    throw "Invalid covServices object";
  }

  const router = express.Router();

  router.get("/login", loginGet);
  router.post("/login", loginPost);
  router.get("/logout", logout);

  return router

  function loginGet(req, rsp) {
    rsp.render('login')
  }

  function loginPost(req, rsp) {
    const credentials = req.body
    
    covServices.verifyLoginCredentials(credentials)
    .then(status =>{
      console.log(`credentials: ${status.validCredentials}`)
      if(status.validCredentials) {
        req.login({ username: credentials.email }, (err) => rsp.redirect('/site/groups'))
      } else {
        rsp.render('login', {warning: status.error, username: credentials.email})
      }
    }).catch(err => console.log(err))
  }

  function logout(req, rsp) {
    req.logout()
    rsp.redirect('/users/login')
  }
}