const router = require('express').Router()
var gameId = 0;
var gameShotId = 0;
const { isRegExp } = require('node:util');
var db = require('../app');
const ArroundTheWorld = require('../engine/gamemodes/around_the_world');

router.route('/')
  .get(function (req, res, next) {
    res.render('show_games.twig', {
      'games': db.db.games
    });
  })
  .post(function (req, res, next) {
    var game = new Game(req.body.name, req.body.gameMode);
    db.db.games.push(game);
    res.redirect('/games');
    //res.end();
  });

router.route('/new')
  .get(function (req, res, next) {
    res.render('create_game.twig', {
      'game': null
    });
  });

router.route('/:id')
  .get(function (req, res, next) {
    var i = 0;
    var trouve = false;
    var game;
    while (i < db.db.games.length && !trouve) {
      if (req.params.id == db.db.games[i].id) {
        trouve = true;
        game = db.db.games[i];
      }
      i++;
    }
    if (!trouve) {
      res.status(404).send('Erreur 404 : Partie non trouvée');
    } else {
      res.render('show_game.twig', {
        'game': game
      })
    }
  })
  .post(function (req, res, next) {
    var i = 0;
    var trouve = false;
    while (i < db.db.games.length && !trouve) {
      if (req.params.id == db.db.games[i].id) {
        trouve = true;
        if (req.body.name) {
          db.db.games[i].name = req.body.name;
        }
        if (req.body.gameMode) {
          db.db.games[i].gameMode = req.body.gameMode;
        }
        if (req.body.status) {
          db.db.games[i].status = req.body.status;
          var random = Math.floor(Math.random() * Math.floor(db.db.games[i].players.length));
          db.db.games[i].currentPlayerId = db.db.games[i].players[random];
          res.redirect('/games/' + db.db.games[i].id + '/');
        }
      }
      i++;
    }
    res.redirect('/games');

  })
  .patch((function (req, res, next) {
    let game = db.db.games[req.id];
    //modifier des parametres uand on est en draft
    //Passer une partie en started quand elle est draft
    //terminer un e partie quan elle est strated
    switch(game.status){
      case 'started':
        if(req.status == 'ended'){
          game.status = req.status ;
        }else{
          //erreur
        }
      break;
      case 'ended':
        //rien de possible FIN DU GAME
      break;
      case 'draft':
        if(req.status == null){
          if(req.name != null){
            game.name = req.name;
          }
          if(req.mode != null){
            game.mode = req.mode;
          }
        }else if (req.status == 'started'){
           game.status = req.status;
           
        }
      break;
    }
    //Push de la game dans la base
    res.redirect("/:"+game.id);
  }));

router.get('/:id/edit', function (req, res, next) {
  var i = 0;
  var trouve = false;
  var game;
  while (i < db.db.games.length && !trouve) {
    if (req.params.id == db.db.games[i].id) {
      trouve = true;
      game = db.db.games[i];
    }
    i++;
  }
  res.render('create_game.twig', {
    'game': game
  });
});
router.route('/:id/players')
  .get(function (req, res, next) {
    var availablesP = [];
    var alreadySelectedP = [];
    var i = 0;
    var trouve = false;
    var game;
    while (i < db.db.games.length && !trouve) {
      if (req.params.id == db.db.games[i].id) {
        trouve = true;
        game = db.db.games[i];
      }
      i++;
    }
    for (var i = 0; i < db.db.players.length; i++) {
      if (game.players.indexOf(db.db.players[i]) == -1) {
        availablesP.push(db.db.players[i]);
      } else {
        alreadySelectedP.push(db.db.players[i]);
      }
    }
    res.render('show_players_game.twig', {
      'availablesP': availablesP,
      'alreadySelectedP': alreadySelectedP
    });
  });

router.route('/:id/addPlayer/:idPlayer')
  .post(function (req, res, next) {
    var i = 0;
    var trouve = false;
    var game;
    while (i < db.db.games.length && !trouve) {
      if (req.params.id == db.db.games[i].id) {
        trouve = true;
        game = db.db.games[i];
      }
      i++;
    }
    var i = 0;
    var trouve = false;
    var player;
    while (i < db.db.players.length && !trouve) {
      if (req.params.idPlayer == db.db.players[i].id) {
        trouve = true;
        player = db.db.players[i];
      }
      i++;
    }
    var gPlayers = game.players;
    gPlayers.push(player);
    game.players = gPlayers;
    res.redirect("/games/" + game.id + "/players");
  });

  router.route('/:id/shots')
  .post(function (req, res, next) {
    //let game = db.db.games[req.id]
    let gameShot = new GameShot(req.id,null,req.sector)

    res.redirect("/games");
  });

class Game {
  constructor(name, mode) {
    this.id = gameId;
    gameId++;
    this.name = name;
    this.mode = mode;
    this.status = 'draft';
    this.currentPlayerId = null;
    this.createdAt = Date.now();

  }
}
  class GameShot {
    constructor(gameId, playerId, sector) {
      this.id = gameShotId;
      gameShotId++;
      this.gameId = gameId;
      this.playerId = playerId;
      this.sector = sector;
      this.multiplicator = null;
      this.createdAt = Date.now();
      
    }
}
module.exports.router = router;