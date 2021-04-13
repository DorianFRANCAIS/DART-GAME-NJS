const router = require('express').Router();
let db = require('../../app');

router.route('/')
  .get(function (req, res, next) {
    console.log(db);
   db.db.collection("players").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.render('show_players.twig',{
      'players': result
    });
  });
   
   
  })
  .post(function (req, res, next) {
    var player = new Player(req.body.name, req.body.email)  ;
    db.db.collection("players").insertOne(player, function(err, res) {  
      if (err) throw err;  
      console.log("1 record inserted");  
      })
    res.redirect('/players');
  });
router.route('/new')
  .get(function (req, res, next) {
    res.render('create_player.twig', {
      'player': null
    });
  });
router.route('/:id/edit')
  .get(async function (req, res, next) {
      const id = parseInt(req.params.id);
      try {
          let player = await db.db.collection('players').find({id}).toArray();
          res.render('create_player.twig', {
            'player': player
          });
        } catch (err) {
          res.status(404).send('Erreur 404 : Joueur non trouvé');
          throw err
      }
    });

router.route('/:id')
  .get(function (req, res, next) {
    res.redirect('/players/' + req.params.id + '/edit');
  })
  .post(async function (req, res, next) {
    if (req.body._method == "patch") {
     
        const id = parseInt(req.params.id);
        try {
            if (req.body.name) {
              let updatedPlayer = {$set:{name : req.body.name}};
              db.db.players.updateOne({id : req.params.id}, updatedPlayer);
            }
            if (req.body.email) {
              let updatedPlayer = {$set:{email : req.body.email}};
              db.db.players.updateOne({id : req.params.id}, updatedPlayer);
            }
            res.redirect('/players');
        }catch (err) {
            res.status(404).send('Erreur 404 : Joueur non trouvé');
            throw err;
  }}});

class Player {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.gameWin = 0;
    this.gameLost = 0;
    this.createdAt = Date.now();
  }
}


module.exports.router = router;