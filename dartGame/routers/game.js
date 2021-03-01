const router = require('express').Router()
var id = 0;
var db = require('../app');

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
    res.end();
  });

router.route('/new')
  .get(function (req, res, next) {
    res.render('create_game.twig', {
      'game': null
    });
  });
router.route('/new.json')
  .get(function (req, res, next) {
    res.json({
      status: 406,
      message: 'NOT_API_AVAILABLE'
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

  });

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
  })
class Game {
  constructor(name, gameMode) {
    this.id = id;
    id++;
    this.name = name;
    this.gameMode = gameMode;
    this.status = 'draft';
    this.players = [];
    this.createdAt = Date.now();
  }
  get getId() {
    return this.id;
  }
  set setGameMode(gamemode) {
    this.gameMode = gamemode;
  }

  get getGameMode() {
    return this.gameMode;
  }

  set setPlayers(players) {
    this.players = players;
  }

  get getPlayers() {
    return this.players;
  }

  set setCurrentPlayerId(playerId) {
    this.currentPlayerId = playerId;
  }

  get getCurrentPlayerId() {
    return this.currentPlayerId;
  }
}
module.exports.router = router;