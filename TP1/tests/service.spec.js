const InitialGames = [
    {
        id: 1,
        name: game1
    }
]

const servicesFunction = require('./../COVIDA/cov_services')(InitialGames)
const dataFunction = require('./../COVIDA/igdb-data')(igdbData)

describe('Remove game from group', (done) => {
    let data = null
    let servicesFunction = null
    beforeEach(()=> {
        data = dataFunction(InitialGames)
        services = servicesFunction(data)
    })

    test('delete', function(){
        services.removeFromGroup(1, (err, data) => {
            expect(err).toBeFalsy()
            expect(initialTasks.length).toBe(0)
            done()
        })
    })
    
    test('delete non existing game', function(done){
        services.removeFromGroup(0, (err,data) => {
            expect(err).toBeTruthy
            services.
        })
    })
})