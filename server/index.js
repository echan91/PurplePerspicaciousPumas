var express = require('express');
var bodyParser = require('body-parser');
var models = require('../db/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = models.userModel;
var Game = models.gameInstanceModel;
var queries = require('../db/db-queries.js');
var helpers = require('./helpers.js');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'orange-to-orange'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../client/dist'));

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post('/signup', function (req, res) {
  console.log('User tried to sign up', req.body.username);
  User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    }
    console.log('registered User');
    passport.authenticate('local')(req, res, function() {
      console.log('success', user);
      res.status(201).send('created');
    })
  });
})

app.post('/login', passport.authenticate('local'), function(req, res) {
  console.log('in login request');
  res.status(201).send('success')
})

app.get('/test', passport.authenticate('local'), function(req, res) {
  res.status(200).send('success')
})

app.get('/games', function(req, res) {
  var promise = Game.find({}).exec();

  promise.then(function(games) {
    var sortedGames = [];
    var gameNameFirstWords = games.map(function(game){
      return game.gameName.split(/\W+/, 1)[0].toLowerCase();
    })
    var sortedGameNameFirstWords = gameNameFirstWords.slice().sort();
    for(var i = 0; i < sortedGameNameFirstWords.length; i++){
      var index = gameNameFirstWords.indexOf(sortedGameNameFirstWords[i]);
      sortedGames.push(games[index]);
      gameNameFirstWords[index] = null;
    }
    res.send(sortedGames);
  })
});

app.post('/games', function(req, res) {
  var gameInstance = req.body;

  helpers.addPrompts(gameInstance);

  Game.create(gameInstance, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).send('success creating game in db');
    }
  })
})

app.get('/game', function(req, res) {
  var name = req.query.name;
  var promise = Game.find({gameName: name}).exec();

  promise.then(function(game) {
    res.json(game);
  })
});

app.get('/username', function(req, res) {
  var user = req.session.passport.user;
  res.status(200).send(user);
});


var server = app.listen(port, function() {
  console.log('App is listening on port: ', port);
});

var io = require('socket.io')(server);

var Sockets = {};
var Rooms = {};
var Games = {}

io.on('connection', (socket) => {
  console.log(`A user connected to the socket`);

/*********************************
  TESTING LOGIC HERE IGNORE
***********************************/
  // socket.on('testing', (data) => {
  //   Sockets.time = data.time;
  //   if (Sockets.timer) {
  //     clearInterval(Sockets.timer);
  //   }
  //   Sockets.timer = setInterval(()=> {
  //     console.log(Sockets.time);
  //     io.emit('timer', {time: Sockets.time-=1});
  //     if (Sockets.time === 1) {
  //       console.log('it works!');
  //       clearInterval(Sockets.timer);
  //     }
  //   }, 1000)
  // })

  // socket.on('stoptimer', (data) => {
  //   console.log('timer stopped', Sockets.timer);
  //   clearInterval(Sockets.timer);
  // })
/*********************************
  TESTING LOGIC HERE 
***********************************/

  socket.on('join game', function(data) {
    // data needs to be gamename and username
    const { username, gameName } = data;

    console.log(`${username} is joining room: ${gameName}`);
    socket.join(gameName);

/**************************************************************
  Instantiates gameTimer information
***************************************************************/

    let gameTimerInformation = Games[gameName] = {
      timer: null,
      time: null
    }

/**************************************************************
  Instantiates gameTimer information
***************************************************************/

    let gameInfo = Sockets[socket] = {
      gameName: gameName
    }
    console.log(`Sockets: ${Sockets[socket].gameName}`);

    Rooms[gameName] ? Rooms[gameName]++ : Rooms[gameName] = 1;
    console.log(`Rooms: ${Rooms[gameName]}`);

    queries.retrieveGameInstance(gameName)
    .then(game => {
      // add client to game DB if they're not already in players list
      if (!game.players.includes(username)) {
        return queries.addPlayerToGameInstance(gameName, username);
      }
    })
    .then(game => {
      const { players, gameStage } = game.value;
      console.log('DATA!', players.length, gameStage);

      if (players.length === 4 && gameStage === 'waiting') {
        queries.setGameInstanceGameStageToPlaying(gameName)
          .then(game => {
            console.log('Starting game: ', game.value)
            io.to(gameName).emit('start game', game.value)

/*******************************************************************
EMIT START ROUND TIMER HERE
******/

            gameTimerInformation.time = 15; //This sets our game time
            gameTimerinformation.timer = setInterval( ()=> {
              io.to(gameName).emit('timer', {time: gameTimerInformation.time -= 1})
              if (gameTimerInformation.time === 0) { //When our timer hits 0, stop our timer
                clearInterval(gameTimerInformation.timer)
                // io.to(gameName).emit('start next round')
              }
            }, 1000)

/*****
EMIT START ROUND TIMER HERE
**********************************************************************/
          });
      } else {
        console.log('Joining Game: ', game.value);
        io.to(gameName).emit('update waiting room', game.value);
      }
    })
    .catch(error => console.log(error))
  });

  socket.on('leave game', (data) => {
    const { username, gameName } = data;

    queries.retrieveGameInstance(gameName)
      .then(game => {
        if (game.players.includes(username)) {
          let currentPlayers = game.players.filter(player => player !== username);

          return queries.removePlayerFromGameInstance(gameName, username);
        } else {
          console.log('Error, username not found');
          return 'Error';
        }
      })
      .then(game => {
        if (game.value.players.length > 0) {
          io.to(gameName).emit('update waiting room', game.value)
        } else {
          // If number of players is now zero then destroy that room
          queries.destroyGameInstance(gameName);
        }
        console.log(`${username} is leaving room: ${gameName}`);
        socket.leave(gameName);
      })
      .catch(error => console.log(error))
  });

  socket.on('prompt created', (data) => {
    var gameName = data.gameName;
    var prompt = data.prompt;

    queries.retrieveGameInstance(gameName)
    .then(function(game) {
      var currentRound = game.currentRound;
      var Rounds = game.rounds.slice(0);

      Rounds[currentRound].prompt = prompt;
      Rounds[currentRound].stage++;

      queries.updateRounds(gameName, Rounds)
      .then(function() {
        queries.retrieveGameInstance(gameName)
        .then(function(game) {
          console.log('ADDED UPDATED GAME: ', game);
          io.to(gameName).emit('prompt added', game);
        })
      })
    })
  })


  socket.on('submit response', (data) => {
    var gameName = data.gameName;
    var username = data.username;
    var response = data.response;

    queries.retrieveGameInstance(gameName)
    .then(function(game) {
      var currentRound = game.currentRound;
      var currentResponses = game.rounds[currentRound].responses;
      var currentRounds = game.rounds;

      if (!helpers.userAlreadySubmitted(username, currentResponses)) {
        currentRounds[currentRound].responses.push([response, username]);

        if (currentRounds[currentRound].responses.length === 3) {
          currentRounds[currentRound].stage++;
        }
        //update rounds property of the game in DB w/ new responses and stage
        return queries.updateRounds(gameName, currentRounds)
        .then(function() {
          if (currentRounds[currentRound].responses.length === 3) {
/*********************************
  CLEAR GAME'S TIMEOUT
***********************************/
            clearInterval(Games.gameName.timer)

/*********************************
  CLEAR GAME'S TIMEOUT
***********************************/
            return queries.retrieveGameInstance(gameName)
            .then(function(game) {
              io.to(gameName).emit('start judging', game);
/*********************************
  START JUDGING TIMER
***********************************/
              Games.gameName.time = 15;

              Games.gameName.timer = setInterval( () => {
                io.to(gameName).emit('timer', {time: Games.gameName.time -= 1})
                if (Games.gameName.time === 0) {
                  clearInterval(Games.gameName.timer);
                  //NEED TO EMIT TO FORCE JUDGE TO EMIT A RESPONSE
                }
              }, 1000)

/*********************************
  START JUDGING TIMER
***********************************/

            })
          }
        })
      }
    }).catch(function(error) {
      console.log(error);
      throw error;
    })
  })

  // on 'judge selection'
  socket.on('judge selection', (data) => {
    var gameName = data.gameName;
    var winner = data.winner;
    console.log('judge selection', data.winner);
    queries.retrieveGameInstance(gameName)
    .then(function (game) {
      var currentRound = game.currentRound;
      var currentResponses = game.rounds[currentRound].responses;
      var Rounds = game.rounds.slice(0);
      Rounds[currentRound].winner = winner;
      Rounds[currentRound].stage++;
      console.log('rounds', Rounds);
      queries.updateRounds(gameName, Rounds)
      .then(function () {
        console.log('gameName', gameName);
        queries.retrieveGameInstance(gameName)
        .then(function (game) {
            if (game.currentRound < 3) {
/************************
  CLEAR INTERVAL IF JUDGE HAS SELECTED
*************************/
              clearInterval(Games.gameName.timer)
/************************
  CLEAR INTERVAL IF JUDGE HAS SELECTED
*************************/
              console.log('winner');
              io.to(gameName).emit('winner chosen', game);
            } else {
              console.log('game over');
              queries.setGameInstanceGameStageToGameOver(gameName).then(function () {
                queries.retrieveGameInstance(gameName).then(function (game) {
                  console.log('gamemover', game);
                  io.to(gameName).emit('game over', game);
                })
              })
            }
          })
        })
    }).catch(function(error) {
      console.log(error);
      throw error;
    })
  })

  socket.on('ready to move on', (data) => {
    console.log('rdy');
    var gameName = data.gameName;
    var username = data.username;
    queries.retrieveGameInstance(gameName)
    .then(function(game) {
      var currentRound = game.currentRound;
      var Rounds = game.rounds.slice(0);
      if (!Rounds[currentRound].ready.includes(username)) {
        Rounds[currentRound].ready.push(username);
        queries.updateRounds(gameName, Rounds)
        .then(function() {
          console.log('rounds', Rounds);
          if (Rounds[currentRound].ready.length === 4) {
            currentRound++;
            queries.updateCurrentRound(gameName, currentRound)
            .then(function() {
              queries.retrieveGameInstance(gameName)
              .then(function(game) {
                io.to(gameName).emit('start next round', game);

/**********************************************
  CLEAR INTERVAL and SET INTERVAL FOR NEXT ROUND
**********************************************/
                clearInterval(Games.gameName.timer)
                Games.gameName.time = 20
                Games.gameName.timer = setInterval( () => {
                  io.to(gameName).emit('timer', {time: Games.gameName.time})
                }, 1000)

/**********************************************
  CLEAR INTERVAL and SET INTERVAL FOR NEXT ROUND
**********************************************/

              })
            })
          }
        })
      }
    }).catch(function(error) {
      console.log(error);
      throw error;
    })
  })


  // socket.on('disconnect', (data) => {
  //   if (Rooms[Sockets[socket].gameName]) {
  //     Rooms[Sockets[socket].gameName]--;
  //     var timer = 60;
  //     var disconnectTimeOut = function() {
  //       setTimeout(function(){
  //         if (timer === 0 && Rooms[Sockets[socket]] < 4) {
  //           console.log('disconnectTimeOut')
  //           queries.setGameInstanceGameStageToGameOver(Sockets[socket])
  //           .then(function(){
  //             console.log(Sockets[socket]);
  //               io.to(Sockets[socket]).emit('disconnectTimeOut');
  //           })
  //         } else {
  //           if (Rooms[Sockets[socket]] < 4) {
  //             console.log(timer, Rooms[Sockets[socket]]);
  //             timer = timer - 1;
  //             disconnectTimeOut();
  //           }
  //         }
  //       }, 1000);
  //     }
  //     queries.retrieveGameInstance(Sockets[socket])
  //     .then(function(game) {
  //       if (game.gameStage === 'playing') {
  //         disconnectTimeOut();
  //       }
  //     });
  //   }

  //   console.log('a user disconnected', data);
  // });

});

