class GameMode{
    constructor(name) {
      this.name = name;
    }
  
    set setName(newName){
      this.name = newName;
    }
  
    get getName(){
      return this.name;
    }
  
    set setDescription(newDescription){
      this.description = newDescription;
    }
  
    get getDescription(){
      return this.description;
    }
  
  }
module.exports = GameMode;  