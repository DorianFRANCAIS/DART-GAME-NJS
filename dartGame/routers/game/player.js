const router = require('express').Router();
const { ObjectId } = require('bson');
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
      try {
          let player = await db.db.collection('players').findOne({'_id': ObjectId(req.params.id)});
          return res.format({
            json: () => res.status(406).json('API_NOT_AVAILABLE') ,
            html: () => res.render('create_player.twig', {
            'player': player
          })});
        } catch (err) {
          res.status(404).send('Erreur 404 : Joueur non trouvé');
          throw err
      }
    });

router.route('/:id')
  .get(async function (req, res, next) {
    let player = await db.db.collection('players').findOne({'_id': ObjectId(req.params.id)});
    return res.format({
      json: () => res.status(200).json(player) ,
      html: () =>res.redirect('/players/' + req.params.id + '/edit')
    });
  })
  .post(async function (req, res, next) {
    if (req.body._method == "patch") {

        try {
            if (req.query.name) { 
              let updatedPlayer = {$set:{name : req.query.name}};
             await db.db.collection('players').updateOne({'_id' : ObjectId(req.params.id)}, updatedPlayer);
            }
            if (req.query.email) {
              let updatedPlayer = {$set:{email : req.query.email}};
              await db.db.collection('players').updateOne({'_id' : ObjectId(req.params.id)}, updatedPlayer);
            }
            let player = await db.db.collection('players').findOne({'_id': ObjectId(req.params.id)});
            return res.format({
              json: () => res.status(200).json(player) ,
              html: () =>res.redirect('/players')});
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