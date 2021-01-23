const { json } = require('express')
const { dbError } = require('../resources.js')
const fs = require('fs')

module.exports = function (users) {
  users = users || require('./users.json')
  return {
    getUser: getUser,
    addUser: addUser
  }


  function addUser(credentials) {
    users.push(credentials)
    console.log(users)
    let n = JSON.stringify(users)
    console.log(n)
    return new Promise((resolve, reject) => {
      fs.writeFile('PI-2021i-LI51D-G04/COVIDA/APP/data/users.json', n, function (err){
        if(err) reject(err)
        resolve('registered')
      })
    })
  }

  function getUser(email) {
    return new Promise((resolve, reject) => {
      res = users.find(u => u.email == email)
      if (res) { resolve(res) }
      else {
        reject(new dbError(`User: ${email} not found`))
      }
    })
  }

}
