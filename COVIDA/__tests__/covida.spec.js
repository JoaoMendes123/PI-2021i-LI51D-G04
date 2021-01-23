/*const frisby = require('frisby');
const serverBase = 'http://localhost:8000/covida/'
const Joi = frisby.Joi

 * PLZ ONLY RUN TESTS WHEN GROUPS.JSON IS EMPTY
 

var editedName = "anotherTestName"
var test_group = {
    "name": Joi.string(),
    "description":Joi.string(),
    "games":Joi.array().min(0).required()
}
var test_group_insertion={
    "name": "testGroup",
    "description": "test Description",
    "games":[]
}
var answer_schema ={
    "status": {
        "message": Joi.string(),
        "result": Joi.any().required()
    },
    "uri": Joi.string()
}
var error_schema ={
    "error": Joi.string().required(),
    "uri":  Joi.string().required()
}

/**
 * Server running 
 
test(`verify if covida API server is running`,()=>{
    return frisby.get(serverBase)
        .expect('status',200)
})
describe("Tests on empty json file",()=>{
    test('listGroups() should give error saying groups.json is empty', ()=>{
        return frisby.get(`${serverBase}groups/list`)
        .expect(`status`,404)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
    test('showGroup() should give error saying groups.json is empty', ()=>{
        return frisby.get(`${serverBase}groups/list`)
        .expect(`status`,404)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
})

describe(`Search for a game in IGDB`,() =>{
    test(`should give bad request because game is not a valid query`,()=>{
        return frisby.get(`${serverBase}games/search?game=Witcher+3`)
        .expect(`status`,422)
        .expect(`bodyContains`,`Invalid query syntax, please make sure query params are according to the documentation.`)
    })
    test(`should give 406 because it cant find the game requested`,()=>{
        return frisby.get(`${serverBase}games/search?name=adadadd`)
        .expect(`status`,406)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8` )
        .expect(`jsonTypes`,{
            'error': 'No matches found on the search for adadadd',
            'uri': "/covida/games/search?name=adadadd"
        })
    })
    test(`should get a game(s) from IGDB API`,()=>{
        return frisby.get(`${serverBase}games/search?name=Witcher+3`)
            .expect(`status`,200)
            .expect(`header`,`Content-Type`,`application/json; charset=utf-8` )
            .expect(`jsonTypes`,answer_schema)
    })
})
describe(`createGroup() in groups.Json`,() =>{
    test('should create a group successfully',()=>{
        return frisby.post(`${serverBase}groups/create/${test_group_insertion.name}`,{
            'description' : test_group_insertion.description
        })
        .expect(`status`,201)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test(`should not create a group successfully because on already exist with ${test_group_insertion.name}`,()=>{
        return frisby.post(`${serverBase}groups/create/${test_group_insertion.name}`,{
            'desc' : 'testDesc'
        })
        .expect(`status`,409)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
})


describe(`editGroup() in groups.Json`,() =>{
    test('Only desc given, should complete anyways',()=>{
        return frisby.put(`${serverBase}groups/edit/${test_group_insertion.name}`,{
            "newDesc" : "desc"
            })
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test('Only name given, should complete anyways',()=>{
        return frisby.put(`${serverBase}groups/edit/${test_group_insertion.name}`,{
            "newName" : `${editedName}`
            })
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test(`should not edit group successfully because it doesnt exist ${editedName}Error`,()=>{
        return frisby.put(`${serverBase}groups/edit/${editedName}Error`,{
            'newName' : 'test1',
            'newDesc' : 'testDesc1'
        })
        .expect(`status`,404)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
    test('Should not change group name because one already exists with given name',()=>{
        return frisby.put(`${serverBase}groups/edit/${editedName}`,{
            "newName" : "anotherTestName"
            })
        .expect(`status`,409)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
})


describe(`addToGroup() adds games to groups in groups.json`, ()=>{
    test(`should sucessfully add to group`,()=>{
        frisby.post(`${serverBase}groups/add/${editedName}`,{"gameID": "2"})
        frisby.post(`${serverBase}groups/add/${editedName}`,{"gameID": "3"})
        frisby.post(`${serverBase}groups/add/${editedName}`,{"gameID": "4"})
        frisby.post(`${serverBase}groups/add/${editedName}`,{"gameID": "5"})
        frisby.post(`${serverBase}groups/add/${editedName}`,{"gameID": "6"})
        frisby.post(`${serverBase}groups/add/${editedName}`,{"gameID": "7"})
        frisby.post(`${serverBase}groups/add/${editedName}`,{"gameID": "8"})
        return frisby.post(`${serverBase}groups/add/${editedName}`,{
            "gameID": "1"
        })
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test(`should not add to group because specified group doesnt exist`,()=>{
        return frisby.post(`${serverBase}groups/add/${editedName}Error`,{
            "gameID": "1"
        })
        .expect(`status`,404)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
    test(`should not add to group because its already in there`,()=>{
        return frisby.post(`${serverBase}groups/add/${editedName}`,{
            "gameID": "1"
        })
        .expect(`status`,409)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
    test(`should not add to group because game doesnt exist`,()=>{
        return frisby.post(`${serverBase}groups/add/${editedName}`,{
            "gameID": "adadadd"
        })
        .expect(`status`,406)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
})
describe("listGroups() with a filled groups.json",()=>{
    test('should print all groups and games available', ()=>{
        return frisby.get(`${serverBase}groups/list`)
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
})
describe("showGroup() with a filled groups.json",()=>{
    test('should print all fields', ()=>{
        return frisby.get(`${serverBase}groups/show/${editedName}`)
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test('should give error because specified group doesnt exist', ()=>{
        return frisby.get(`${serverBase}groups/show/${editedName}4`)
        .expect(`status`,404)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
})
describe("removeFromGroup() removes games from groups",()=>{
    test('should remove game sucessfully',()=>{
        return frisby.del(`${serverBase}groups/remove/${editedName}`,{
            "gameID" : "1"
        })
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test('should give error because game isnt present in group',()=>{
        return frisby.del(`${serverBase}groups/remove/${editedName}`,{
            "gameID" : "178954"
        })
        .expect(`status`,406)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
    test('should give error because group doesnt exist',()=>{
        return frisby.del(`${serverBase}groups/remove/${editedName}2`,{
            "gameID" : "2"
        })
        .expect(`status`,404)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
})
describe(`getGamesBetween() returns a list of sorted games from a certain group that fit in specified interval`,()=>{
    test(`should list games successfully`,()=>{
        return frisby.get(`${serverBase}groups/${editedName}?minRating=65&maxRating=80`)
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test(`only max specified, should list games successfully`,()=>{
        return frisby.get(`${serverBase}groups/${editedName}?maxRating=95`)
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test(`only min specified, should list games successfully`,()=>{
        return frisby.get(`${serverBase}groups/${editedName}?minRating=60`)
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test(`invalid interval, should send error`,()=>{
        return frisby.get(`${serverBase}groups/${editedName}?minRating=90&maxRating=60`)
        .expect(`status`,406)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,error_schema)
    })
})*/