const router = require('express').Router();
const db = require('../../app');
var idPlayer = 0;
var idGamePlayer = 0;

router.route('/')
  .get(function (req, res, next) {
    players = db.db.players;
    console.log(players);
    res.render('show_players.twig', {
      'players': players
    });
  })
  .post(function (req, res, next) {
    var player = new Player(req.body.name, req.body.email);
    db.db.players.push(player);
    res.redirect('/players');
  });
router.route('/new')
  .get(function (req, res, next) {
    res.render('create_player.twig', {
      'player': null
    });
  });
router.route('/:id/edit')
  .get(function (req, res, next) {
    var i = 0;
    var trouve = false;
    var player;
    while (i < db.db.players.length && !trouve) {
      if (req.params.id == db.db.players[i].id) {
        trouve = true;
        player = db.db.players[i];
      }
      i++;
    }
    if (!trouve) {
      res.status(404).send('Erreur 404 : Joueur non trouvé');
    } else {
      res.render('create_player.twig', {
        'player': player
      })
    }

  });
router.route('/:id')
  .get(function (req, res, next) {
    res.redirect('/players/' + req.params.id + '/edit');
  })
  .post(function (req, res, next) {
    if (req.body._method == "patch") {
      var i = 0;
      var trouve = false;
      while (i < db.db.players.length && !trouve) {
        if (req.params.id == db.db.players[i].id) {
          trouve = true;
          if (req.body.name) {
            db.db.players[i].name = req.body.name;
          }
          if (req.body.email) {
            db.db.players[i].email = req.body.email;
          }
        }
        i++;
      }
      res.redirect('/players');
    }
  });

class Player {
  constructor(name, email) {
    this.name = name;
    this.id = idPlayer;
    idPlayer++;
    this.email = email;
    this.gameWin = 0;
    this.gameLost = 0;
    this.createdAt = Date.now();
  }
}

class GamePlayer {
  constructor(playerId,gameId) {
    this.id = idGamePlayer
    idGamePlayer++;
    this.playerId = playerId;
    this.gameId = gameId
    this.remainingShots = null;
    this.score = 0;
    this.rank = null;
    this.order = null;
    this.inGame = true;
    this.createdAt = Date.now();
  }
}
module.exports.router = router;