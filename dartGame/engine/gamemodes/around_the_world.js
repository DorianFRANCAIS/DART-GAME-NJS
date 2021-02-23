class ArroundTheWorld {
    darts = 3
    nbPlayers = 0
    maxTarget = 20
    targetNumber = []
    targetReach = null
    //Méthode pour définir le 1er joueur qui va début la partie
    getFirstPlayer = (nbPlayers) => {
    var min = Math.floor(1);
    var max = Math.floor(nbPlayers);
    return Math.floor(Math.random() * (max-min))
    }
    //Création du plateau de jeu de fléchettes
    gameBoard = () => {
    for(let x=0; x <= 20; x++) {
    this.targetNumber[x] = x
    }
    var targetNumber = this.targetNumber
    return targetNumber
    }
    game = () => {
    var firstTarget = 1
    var inputValue = 1
    if(firstTarget === inputValue) {
    this.targetReach = true
    firstTarget++
    console.log(`Bien joué tu as atteint ta cible, cible suivante : ${firstTarget}`)
    }
    return firstTarget
    }
   }
   module.exports = ArroundTheWorld