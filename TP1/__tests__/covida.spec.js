const frisby = require('frisby');
const serverBase = 'http://localhost:8000/covida/'
const Joi = frisby.Joi

var test_group = {
    "name": "testGroup",
    "description":"A generic one",
    "games":[
        {
            "id": 1,
            "name": "game1",
            "total_rating": 86.84180103858729
        },
        {
            "id": 2,
            "name": "game2",
            "total_rating": 78.3080223324581
        },
        {
            "id": 3,
            "name": "game3",
            "total_rating": 74.9577789549123
        },
        {
            "id": 4,
            "name": "game4",
            "total_rating": 64.15454275834695
        },
        {
            "id": 5,
            "name": "game5"
        }
    ]
}
var testGame={
    "id": Joi.number(),
    "name": Joi.string(),
    "total_rating": Joi.number()
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
            .expect(`jsonTypes`,Joi.array().items(testGame))
    })
})
/**
 * NOT WORKING CAUSE I CANT SEND BODY 
 */
describe(`createGroup() in groups.Json`,() =>{
    test('should create a group successfully',()=>{
        return frisby.post(`${serverBase}groups/create/${test_group.name}`,{
            'description' : test_group.description
        })
        .expect(`status`,201)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,{
            'status':  `group ${test_group.name} created successfully.`,
            'uri':  `/covida/groups/create/${test_group.name}`
        })
    })
    test(`should not create a group successfully because on already existe with ${test_group.name}`,()=>{
        return frisby.post(`${serverBase}groups/create/${test_group.name}`,{
            'desc' : 'testDesc'
        })
        .expect(`status`,409)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,{
            'status':  `group ${test_group.name} created successfully.`,
            'uri':  `/covida/groups/create/${test_group.name}`
        })
    })
})

describe(`editGroup() in groups.Json`,() =>{
    test('Only desc given, should complete anyways',()=>{
        console.log(test_group.name)
        return frisby.put(`${serverBase}groups/edit/${test_group.name}`,{
            "newDesc" : "desc"
            })
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,{
            "name" : "${test_group.name}",
            "description" : "edited desc"
            })
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
    
    