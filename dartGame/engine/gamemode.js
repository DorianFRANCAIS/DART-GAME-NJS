class GameMode{
    constructor(name, description) {
      this.name = name;
      this.description = description;
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