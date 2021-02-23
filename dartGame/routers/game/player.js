class Player{
    constructor(name) {
      this.name = name;
    }
  
    set setName(newName){
      this.name = newName;
    }
  
    get getName(){
      return this.name;
    }
  
  }
module.exports = Player;  