const router = require("express").Router();
const { ObjectId } = require("bson");
let db = require("../app");
const { checkValue } = require("../engine/gamemodes/around_the_world");
const engine = require("../engine/gamemodes/around_the_world");
let date = new Date();

router
  .route("/")
  .get(function (req, res, next) {
    db.db
      .collection("games")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        return res.format({
          json: () => res.status(200).json(result),
          html: () =>
            res.render("show_games.twig", {
              games: result,
            }),
        });
      });
  })
  .post(function (req, res, next) {
    let game = new Game(req.body.name, req.body.mode);
    db.db.collection("games").insertOne(game, function (err, res) {
      if (err) throw err;
      console.log("1 game inserted");
    });
    return res.format({
      json: () => res.status(201).json(game),
      html: () => res.redirect("/games"),
    });
  });

router.route("/new").get(function (req, res, next) {
  return res.format({
    json: () => res.status(406).json("API_NOT_AVAILABLE"),
    html: () =>
      res.render("create_game.twig", {
        game: null,
      }),
  });
});

router
  .route("/:id")
  .get(async function (req, res, next) {
    const id = req.params.id;
    try {
      let game = await db.db.collection("games").findOne({ _id: ObjectId(id) });
      let currentPlayer = await db.db
        .collection("players")
        .findOne({ _id: ObjectId(game.currentPlayerId) });
      return res.format({
        json: () => res.status(200).json(game),
        html: () =>
          res.render("show_game.twig", {
            game: game,
            currentPlayer: currentPlayer,
          }),
      });
    } catch (err) {
      res.status(404).send("Erreur 404 : Partie non trouvée");
      throw err;
    }
  })
  .post(async function (req, res, next) {
    if (req.body._method == "patch") {
      try {
        let game = await db.db
          .collection("games")
          .findOne({ _id: ObjectId(req.params.id) });
        if (game.status == "draft") {
          updatedGame = { $set: { status: req.body.status } };
          await db.db
            .collection("games")
            .updateOne({ _id: ObjectId(req.params.id) }, updatedGame);

          let gamePlayers = await db.db
            .collection("gamePlayers")
            .find({ gameId: req.params.id })
            .toArray();
          let player = await engine.setRunningOrder(gamePlayers);

          await db.db
            .collection("games")
            .updateOne(
              { _id: ObjectId(req.params.id) },
              { $set: { currentPlayerId: player.playerId } }
            );

          return res.format({
            json: () => res.status(200).json(game),
            html: () => res.redirect("/games/" + req.params.id),
          });
        } else {
          return res.format({
            json: () => res.status(410).json("GAME_NOT_EDITABLE"),
            html: () => res.redirect("/games/" + req.params.id),
          });
        }
      } catch (err) {
        throw err;
      }
    }
  });

router.post("/:id/edit", async function (req, res, next) {
  try {
    let updatedGame;
    let game = await db.db
      .collection("games")
      .findOne({ _id: ObjectId(req.params.id) });
    if (req.body.name) {
      updatedGame = { $set: { name: req.body.name } };
      await db.db
        .collection("games")
        .updateOne({ _id: ObjectId(req.params.id) }, updatedGame);
    }
    if (req.body.mode) {
      updatedGame = { $set: { mode: req.body.mode } };
      await db.db
        .collection("games")
        .updateOne({ _id: ObjectId(req.params.id) }, updatedGame);
    }

    return res.format({
      json: () => res.status(406).json("API_NOT_AVAILABLE"),
      html: () => res.redirect("/games/" + game._id),
    });
  } catch (err) {
    res.status(404).send("Erreur 404 : Partie non trouvée");
    throw err;
  }
});
router.route("/:id/players").get(async function (req, res, next) {
  try {
    let game = await db.db
      .collection("games")
      .findOne({ _id: ObjectId(req.params.id) });
    let players = await db.db.collection("players").find().toArray();
    let gamePlayers = await db.db
      .collection("gamePlayers")
      .find({ gameId: req.params.id })
      .toArray();
    let playersInGame = [];
    for (let gamePlayer of gamePlayers) {
      let player = await db.db
        .collection("players")
        .findOne({ _id: ObjectId(gamePlayer.playerId) });
      playersInGame.push(player);
      players.pop(player);
    }

    return res.format({
      json: () => res.status(200).json(playersInGame),
      html: () =>
        res.render("show_players_game.twig", {
          availablesP: players,
          alreadySelectedP: playersInGame,
          game: game,
        }),
    });
  } catch (err) {
    throw err;
  }
});

router.route("/:id/addPlayer/:idPlayer").post(function (req, res, next) {
  try {
    let gamePlayer = new GamePlayer(req.params.idPlayer, req.params.id);
    db.db.collection("gamePlayers").insertOne(gamePlayer, function (err, res) {
      if (err) throw err;
      console.log("1 player inserted");
    });
    return res.format({
      json: () => res.status(204).json(),
      html: () => res.redirect("/games/" + req.params.id + "/players"),
    });
  } catch (err) {
    throw err;
  }
});

router.route("/:id/shots").post(async function (req, res, next) {
  let game = await db.db
    .collection("games")
    .findOne({ _id: ObjectId(req.params.id) });
  let gameShot = new GameShot(game._id, game.currentPlayerId, req.query.sector);
  db.db.collection("gameShots").insertOne(gameShot, function (err, res) {
    if (err) throw err;
    console.log("1 gameShot inserted");
  });
  let gamePlayer = await db.db
    .collection("gamePlayers")
    .findOne({ playerId: game.currentPlayerId });

  await engine.checkValue(gamePlayer, req.query.sector);
  return res.format({
    json: () => res.status(204).json(),
    html: () => res.redirect("/games/" + req.params.id),
  });
});

class Game {
  constructor(name, mode) {
    this.name = name;
    this.mode = mode;
    this.status = "draft";
    this.currentPlayerId = null;
    this.createdAt = date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate()+'-'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    console.log("DATE:",this.createdAt);
  }
}
class GameShot {
  constructor(gameId, playerId, sector) {
    this.gameId = gameId;
    this.playerId = playerId;
    this.sector = sector;
    this.multiplicator = null;
    this.createdAt = date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate()+'-'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  }
}
class GamePlayer {
  constructor(playerId, gameId) {
    this.playerId = playerId;
    this.gameId = gameId;
    this.remainingShots = null;
    this.score = 1;
    this.rank = null;
    this.order = null;
    this.inGame = true;
    this.createdAt = date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate()+'-'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  }
}

module.exports.router = router;
