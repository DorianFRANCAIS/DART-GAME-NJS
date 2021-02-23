class Game {
    constructor(nbPlayers) {
      this.nbPlayers = nbPlayers;
    }
  
    get getNbPlayers() {
      return this.nbPlayers;
    }
  
    set setGameMode(gamemode){
      this.gameMode = gamemode;
    }
  
    get getGameMode() {
      return this.gameMode;
    }

    set setPlayers(players){
        this.players = players;
      }
    
      get getPlayers() {
        return this.players;
      }
  }
  module.exports = Game;