const { dbError } = require('./resources.js')

module.exports = function(users) {
    users = users || require('./users.json')
    return { 
      getUser:getUser
    
    }

    
    function addUser(credentials){

    }
    function getUser(username) {
      return new Promise((resolve,reject)=>{
          res = users.find(u => u.username == username)
          console.log(`result : ${res.username}`)
          if(res) {resolve(res)}
          else {
            console.log("error was thrown")
            reject(new dbError(`User: ${username} not found`))}
        })
    }
    
}
  