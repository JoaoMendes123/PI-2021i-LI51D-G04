const fs = require('fs')
module.exports =  () => {
    let groups = initDB() || []
  
    
    function initDB(){
        fs.readFile('./groups.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err)
                return false
            }
            console.log("cona")
        })
       
        return groups
    }
    return {
        /* searchGames: searchGames,
         createGroup: createGroup,
         editGroup: editGroup,
         listGroups: listGroups,
         showGroup: showGroup,
         addToGroup: addToGroup,
         removeFromGroup: removeFromGroup,
         getGamesBetween: getGamesBetween*/
     }

}