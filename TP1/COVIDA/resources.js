//Answer Objects to use in cov_web_api
function Answer(msg, ans){
    this.message = msg,
    this.answer = ans
}

function Error(msg, uri){
    this.error = msg
    this.uri = uri
}
//Group Objects to use in cov_db
function Group(group_name, group_description = "", games) {
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

