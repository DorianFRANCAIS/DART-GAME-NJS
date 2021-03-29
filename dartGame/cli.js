const inquirer = require('inquirer');
const Game = require('./routers/game.js');
const GameMode = require('./engine/gamemode.js');
const Player = require('./routers/game/player.js');


async function cli(){
  
  const confirmNbPlayersValidator = (input) => {
    var inputToInt = parseInt(input);
    if (inputToInt >= 2) {
      currentGame = new Game(inputToInt);
      return true;
    }
    return "Réponse incorrecte. Merci de renseigner un nombre de joueurs valide."
  };

const inputNbPlayers = await inquirer.prompt({
    type: 'input',
    name: 'NbPlayers',
    message: 'A combien voulez-vous jouer ? (Minimum 2 joueurs)',
    validate: confirmNbPlayersValidator,
  })
  .then(answers => {
    console.info('Vous êtes ' + currentGame.nbPlayers + ' joueurs.');
  });

  const inputGameMode = await inquirer.prompt([
    {
      type: 'list',
      name: 'gameMode',
      message: 'A quel mode de jeu voulez-vous jouer ?',
      choices: [
        {
          value: 'Tour du monde',
        },
        {
          value: '301',
        },
        {
          value: 'Cricket',
        },
      ],
    },
  ])
  .then(answers => {
    currentGame.setGameMode = new GameMode(answers.gameMode);
    console.info('Vous avez choisi le mode :', answers.gameMode);
  });

    var players = [];

  for(i = 1; i <= currentGame.getNbPlayers;i++){
    const inputNames = await inquirer.prompt([
      {
        type: 'input',
        name: 'playerName',
        message: 'Joueur '+i+': Merci de renseigner votre nom',
      },
    ])
    .then(answer => {
      currentGame.setPlayers = players.push(new Player(answer.playerName));
      console.info('Vous avez choisi le nom :', answer.playerName);
    });
  }

}

cli();