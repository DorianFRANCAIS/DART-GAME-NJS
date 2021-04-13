var module = require("module");
var express = require('express');
var twig = require('twig');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'dart';
let db ;

MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");
  db = client.db(dbName);
  var app = express();
app.set('views', __dirname + '/templates');
app.set('view engine', 'html');
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json({
  extended: true
}));
app.engine('html', twig.__express);
var games = require('./routers/game').router;
var players = require('./routers/game/player').router;

app.use('/games', games);
app.use('/players', players);
app.route("/")
  .get(function (req, res, next) {
    res.render('homePage.html');
  });
app.listen(8080);
  exports.db = db;
});


