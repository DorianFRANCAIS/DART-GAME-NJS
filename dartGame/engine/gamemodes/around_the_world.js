const { ObjectId } = require('bson');
let db = require('../../app');

class ArroundTheWorld {
    darts = 3
    nbPlayers = 0
    maxTarget = 20
    targetNumber = []
    target = 1;
    //Méthode pour définir le 1er joueur qui va début la partie
    async setRunningOrder(players) {
            for (var i = players.length -1; i >= 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = players[i];
                players[i] = players[j];
                players[j] = temp;
                let updatedPlayer = {$set:{'order' : j}};
                console.log('GamePlayer :',players[j]._id);
               let result = await db.db.collection('gamePlayers').updateOne({'_id' : ObjectId(players[j]._id)}, updatedPlayer);
            }

        }
    
    
    //Création du plateau de jeu de fléchettes
    gameBoard() {
    for(let x=0; x <= 20; x++) {
    this.targetNumber[x] = x
    }
    let targetNumber = this.targetNumber
    return targetNumber
    }
    game(inputValue) {
    if(target === inputValue) {
    target++
    console.log(`Bien joué tu as atteint ta cible, cible suivante : ${target}`)
        }
    }
   }
   module.exports = new ArroundTheWorld();