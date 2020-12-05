const bodyparser = require('body-parser')
const frisby = require('frisby');
const serverBase = 'http://localhost:8000/covida/'
const Joi = frisby.Joi

/**
 * Server running 
 * If error server is not running
 */
test(`verify if covida API server is running`,()=>{
    return frisby.get(serverBase)
        .expect('status',200)
})

describe(`Search for a game`,() =>{
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
            'error': Joi.string().required(),
            'uri': "/covida/games/search?name=adadadd"
        })
    })
    test(`should get a game(s) from IGDB API`,()=>{
        return frisby.get(`${serverBase}games/search?name=Witcher+3`)
            .expect(`status`,200)
            .expect(`header`,`Content-Type`,`application/json; charset=utf-8` )
            .expect(`jsonTypes`,'*',{
                'name': Joi.string().required(),
                'id': Joi.number().required(),
                'total_rating': Joi.number()
            })
    })
})
/**
 * NOT WORKING CAUSE I CANT SEND BODY 
 */
describe(`Create group in groups.Json`,() =>{
    test('should create a group successfully',()=>{
        return frisby.post(`${serverBase}groups/create`,{
            'groupName' : 'test',
            'desc' : 'testDesc'
        })
        .expect(`status`,200)
        .expect(`header`,`Content-Type`,`application/json; charset=utf-8`)
        .expect(`jsonTypes`,'*',{
            'status': Joi.string().required(),
            'uri':  "/covida/groups/create"
        })
    })
})
    
    