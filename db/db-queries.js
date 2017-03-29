var models = require('./index.js');
var games = models.db.collection('gameinstancemodels');

module.exports.retrieveGameInstance = function(gameName) {

  return games.findOne({gameName: gameName});
};

module.exports.destroyGameInstance = function(gameName) {

  return games.deleteOne({gameName: gameName});
};

module.exports.addPlayerToGameInstance = function(gameName, players) {

  return games.update({gameName: gameName}, {$set: {players: players} });
};

module.exports.setGameInstanceGameStageToPlaying = function(gameName) {

  return games.update({gameName: gameName}, { $set: {gameStage: 'playing'} });
};

module.exports.updateRounds = function(gameName, roundsArray) {

  return games.update({gameName: gameName}, { $set: {rounds: roundsArray} });
};

module.exports.updateCurrentRound = function(gameName, round) {

  return games.update({gameName: gameName}, { $set: {currentRound: round} });
}

module.exports.setGameInstanceGameStageToGameOver = function(gameName) {

  return games.update({gameName: gameName}, { $set: {gameStage: 'gameover'} });
};