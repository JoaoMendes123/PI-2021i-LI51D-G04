const frisby = require('frisby');
const serverBase = 'http://localhost:8000/covida/'
const Joi = frisby.Joi

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

/**
 * Server running 
 */
test(`verify if covida API server is running`,()=>{
    return frisby.get(serverBase)
        .expect('status',200)
})

describe(`Search for a game in IGDB`,() =>{
    test(`should give bad request because game is not a valid query`,()=>{
        return frisby.get(`${serverBase}games/search?game=Witcher+3`)
        .expect(`status`,422)
        .expect(`bodyContains`,`Invalid query syntax, please make sure query params are according to the documentation.`)
    })
    test(`should give 404 because it cant find the game requested`,()=>{
        return frisby.get(`${serverBase}games/search?name=adadadd`)
        .expect(`status`,404)
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
/**
 * NOT WORKING CAUSE I CANT SEND BODY 
 */
describe(`createGroup() in groups.Json`,() =>{
    test('should create a group successfully',()=>{
        return frisby.post(`${serverBase}groups/create/${test_group_insertion.name}`,{
            'description' : test_group_insertion.description
        })
        .expect(`status`,201)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,answer_schema)
    })
    test(`should not create a group successfully because on already existe with ${test_group_insertion.name}`,()=>{
        return frisby.post(`${serverBase}groups/create/${test_group_insertion.name}`,{
            'desc' : 'testDesc'
        })
        .expect(`status`,409)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,{
            "error": `Can't create new group with ${test_group_insertion.name} because one already exists `,
            "uri": `/covida/groups/create/${test_group_insertion.name}`
        })
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
    test(`should not edit group successfully because it doesnt exist ${test_group.name}Error`,()=>{
        return frisby.put(`${serverBase}groups/edit/${test_group.name}Error`,{
            'newName' : 'test1',
            'newDesc' : 'testDesc1'
        })
        .expect(`status`,422)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,{
            'status':  `group ${test_group.name} created successfully.`,
            'uri':  `/covida/groups/create/${test_group.name}`
        })
    })
})
    
    