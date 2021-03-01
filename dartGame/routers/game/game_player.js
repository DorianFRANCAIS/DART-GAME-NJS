const Player = require("./player");
var id =0;
class GamePlayer extends Player{
    constructor(playerId,gameId){
       this.id = id;
       id++;
       this.playerId = playerId;
       this.gameId = gameId;
       this.remainingshots = null;
       this.score = 0;
       this.rank = null;
       this.order = null;
       this.inGame = true;
       this.createdAt = Date.now();

    }
}
module.exports = GamePlayer;