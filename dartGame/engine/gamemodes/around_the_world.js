class ArroundTheWorld {
    darts = 3
    nbPlayers = 0
    maxTarget = 20
    targetNumber = []
    target = 1;
    //Méthode pour définir le 1er joueur qui va début la partie
    getFirstPlayer(nbPlayers) {
    var min = Math.floor(1);
    var max = Math.floor(nbPlayers);
    return Math.floor(Math.random() * (max-min))
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
   module.exports = ArroundTheWorld