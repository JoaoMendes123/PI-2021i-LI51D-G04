module.exports = {
        Answer,
        Error,
        Group,
        Game
}
//Answer Objects to use in cov_web_api
function Answer(msg, ans){
    this.message = msg,
    this.answer = ans
}

function Error(msg, status){
    this.message = msg
    this.status = status
}
//Group Objects to use in cov_db
function Group(group_id, group_name, group_description = "", games) {
    this.id =  group_id,
    this.name = group_name,
    this.description = group_description,
    this.games = games
}
//Game Objects to use in igdb_data
function Game(id, name, total_rating){
    this.id = id,
    this.name = name,
    this.total_rating = total_rating
}

