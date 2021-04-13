const router = require('express').Router()
const { ObjectId } = require('bson');
let db = require('../app');
const engine = require('../engine/gamemodes/around_the_world');

router.route('/')
  .get(function (req, res, next) {
    db.db.collection("games").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
    res.render('show_games.twig', {
      'games': result
    });
  })})
  .post(function (req, res, next) {
    var game = new Game(req.body.name, req.body.gameMode);
    db.db.collection("games").insertOne(game, function(err, res) {  
      if (err) throw err;  
      console.log("1 game inserted");  
      })
    res.redirect('/games');
  });

router.route('/new')
  .get(function (req, res, next) {
    res.render('create_game.twig', {
      'game': null
    });
  });

router.route('/:id')
  .get(async function (req, res, next) {
    const id = req.params.id;
      try {
        console.log("Id : ",id);
        let game = await db.db.collection('games').findOne({'_id' :  ObjectId(id)});
        console.log(game);
        res.render('show_game.twig', {
          'game': game
        });
        } catch (err) {
          res.status(404).send('Erreur 404 : Partie non trouvée');
          throw err
      }
  })
  .post(async function (req, res, next) {
    if(req.body._method == "PATCH"){
      updatedGame = {$set:{'status' : req.body.status}};
      //Si started, definir joueur courant / Ordre de passage etc
      let players = await db.db.collection('gamePlayers').find({'gameId' : req.params.id }).toArray();
      engine.setRunningOrder(players);

      await db.db.collection('games').updateOne({'_id' : ObjectId(req.params.id)}, updatedGame);
      res.redirect('/games/'+req.params.id);  

    }

  })

router.post('/:id/edit', async function (req, res, next) {
  try {
    let updatedGame;
    let game = await db.db.collection('games').findOne({'_id' : ObjectId(req.params.id)});
    if (req.body.name) {
      updatedGame = {$set:{'name' : req.body.name}};
      await db.db.collection('games').updateOne({'_id' : ObjectId(req.params.id)}, updatedGame);
    }
    if (req.body.mode) {
     updatedGame = {$set:{'mode' : req.body.mode}};
     await db.db.collection('games').updateOne({'_id' : ObjectId(req.params.id)}, updatedGame);
    }
    
    res.redirect('/games/'+game._id);
}catch (err) {
    res.status(404).send('Erreur 404 : Joueur non trouvé');
    throw err;
}
});
router.route('/:id/players')
  .get(async function (req, res, next) {
    try {
      let players = await db.db.collection('players').find().toArray();
      let gamePlayers = await db.db.collection('gamePlayers').find({'gameId' : req.params.id }).toArray();
      let playersInGame = [] ;
      for(let gamePlayer of gamePlayers){
        let player = await db.db.collection('players').findOne({'_id' : ObjectId(gamePlayer.playerId)});
        console.log(player);
        playersInGame.push(player);
        players.pop(player);
      }

      res.render('show_players_game.twig', {
        'availablesP' : players,
        'alreadySelectedP': playersInGame
      });
      } catch (err) {
        
        throw err
    }
     
   
  });

router.route('/:id/addPlayer/:idPlayer')
  .post(function (req, res, next) {
    try {
      let gamePlayer = new GamePlayer(req.params.idPlayer, req.params.id);
      db.db.collection("gamePlayers").insertOne(gamePlayer, function(err, res) {  
        if (err) throw err;  
        console.log("1 player inserted");  
        })
        res.redirect("/games/" + req.params.id + "/players");
      } catch (err) {
        
        throw err
    }
 
  });

  router.route('/:id/shots')
  .post(async function (req, res, next) {
    let game = await db.db.collection('games').findOne({'_id' : ObjectId(req.params.id)});
    let gameShot = new GameShot(game._id,game.currentPlayerId,req.query.sector);
    db.db.collection("gameShots").insertOne(gameShot, function(err, res) {  
      if (err) throw err;  
      console.log("1 gameShot inserted");  
      });
    res.redirect("/games");
  });

  router.route('/:id/play')
  .get(async function (req, res, next) {
    try {
      let gamePlayers = await db.db.collection('gamePlayers').find({'gameId' : req.params.id }).toArray();
      let playersInGame = [] ;
      for(let gamePlayer of gamePlayers){
        let player = await db.db.collection('players').findOne({'_id' : ObjectId(gamePlayer.playerId)});
        playersInGame.push(player);
      }

      res.render('gameboard.twig', {
        'players': playersInGame
      });
      } catch (err) {
        
        throw err
    }
     
   
  });

class Game {
  constructor(name, mode) {
    this.name = name;
    this.mode = mode;
    this.status = 'draft';
    this.currentPlayerId = null;
    this.createdAt = Date.now();

  }
}
  class GameShot {
    constructor(gameId, playerId, sector) {
      this.gameId = gameId;
      this.playerId = playerId;
      this.sector = sector;
      this.multiplicator = null;
      this.createdAt = Date.now();
      
    }
}
class GamePlayer {
  constructor(playerId,gameId) {
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