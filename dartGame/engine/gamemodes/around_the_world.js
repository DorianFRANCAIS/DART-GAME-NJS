const { ObjectId } = require('bson');
let db = require('../../app');

class ArroundTheWorld {

    //Méthode pour définir le 1er joueur qui va début la partie
    async setRunningOrder(players) {
        const shuffledPlayers = [...players];
        let firstPlayer ;
        for (let i = shuffledPlayers.length - 1; i > 0; i --) { 
          const j = Math.floor(Math.random() * (i + 1));
          const temp = shuffledPlayers[i];
          shuffledPlayers[i] = shuffledPlayers[j];
          shuffledPlayers[j] = temp;

         

        }
        try{
            await Promise.all(shuffledPlayers.map((player, i) => 
            db.db.collection('gamePlayers').updateOne(
              {'_id': ObjectId(player._id)},
              { $set: { order: i, remainingShots: 3}}
            )
          ))
        }catch (err){
            throw(err);
        }
        return shuffledPlayers[0];
        }
        
        async checkValue(gamePlayer,inputSector){
            console.log(gamePlayer);
            if(gamePlayer.remainingShots > 0){
                if(gamePlayer.score == inputSector){
                   await db.db.collection('gamePlayers').updateOne(
                        {'_id': ObjectId(gamePlayer._id)},
                        { $set: {score: gamePlayer.score++}}
                      )
                    }
                      await db.db.collection('gamePlayers').updateOne(
                        {'_id': ObjectId(gamePlayer._id)},
                        { $set: {remainingShots: gamePlayer.remainingShots--}}
                      );
                      console.log(gamePlayer);

                                    
            }else{
                this.changeCurrentPlayer(gamePlayer.gameId);
            }
            
            

        }

        async changeCurrentPlayer(gameId){
            let game = await db.db.collection('games').findOne({'_id' : ObjectId(gameId)});
            console.log(game);
            let currentPlayer = await db.db.collection('gamePlayers').findOne({'playerId' : game.currentPlayerId});
            nextId = currentPlayer.order ++;
            let newCurrentPlayer =  db.db.collection('gamePlayers').findOne({'gameId': game._id , 'order' : nextId})
            await db.db.collection('games').updateOne({'_id': ObjectId(gameId)},{$set:{'currentPlayerId':newCurrentPlayer.playerId}});
        }
}
   module.exports = new ArroundTheWorld();