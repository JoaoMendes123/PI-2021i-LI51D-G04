module.exports = function(groups) {
    groups = groups || createInitialGroup()
    let maxId = groups.reduce( (max, curr) => curr.id > max ? curr.id : max)

  
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
    function createInitialGroup(){
        let groups = [0,1,2,3,4,5,6]
        groups = groups.map((dc,i) => {
            return{
                id: i,
                name: `Group ${i}`,
                description: `Description Group ${i}`

            }
        })
        return groups
    }

}