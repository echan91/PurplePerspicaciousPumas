// var models = require('./index.js');
// var mongoose = require('mongoose');
// var gameInstance = models.gameInstanceModel;

// module.exports.PurplePumaWaiting1 = {
// 	gameName: 'Purple-Puma-One-Player',
// 	password: '',
// 	players: [],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 2', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 0
// };

// module.exports.PurplePumaWaiting2 = {
// 	gameName: 'Purple-Puma-Two-Players',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 2', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 0
// };

// module.exports.PurplePumaWaiting3 = {
// 	gameName: 'Purple-Puma-Three-Players',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 2', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 0
// };

// // This model should never be passed to players
// // server should see players.length === 4 and change game stage
// // to playing
// module.exports.PurplePumaWaiting4 = {
// 	gameName: 'Purple-Puma-Four-Players',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 2', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 0
// };


// module.exports.PurplePumaPlayingR0S0 = {
// 	gameName: 'Purple-Puma-Playing-Round-0-Stage-0',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 2', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 0,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR0S1 = {
// 	gameName: 'Purple-Puma-Playing-Round-0-Stage-1',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: '', stage: 1, ready: []},
// 	{prompt: 'prompt 2', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 0,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR0S2 = {
// 	gameName: 'Purple-Puma-Playing-Round-0-Stage-2',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 2, ready: []},
// 	{prompt: 'prompt 2', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 0,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR1S0 = {
// 	gameName: 'Purple-Puma-Playing-Round-1-Stage-0',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 0, ready: []},
// 	{prompt: 'prompt 2', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 1,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR1S1 = {
// 	gameName: 'Purple-Puma-Playing-Round-1-Stage-1',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 2, ready: []},
// 	{prompt: 'prompt 2', responses: [['Response 2 Edward', 'Edward K. Chan'], ['Response 2 Sarah', 'Sarah Peterson'], ['Response 2 Jenny', 'Jenny Turner']], winner: '', stage: 1, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 1,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR1S2 = {
// 	gameName: 'Purple-Puma-Playing-Round-1-Stage-2',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 2, ready: []},
// 	{prompt: 'prompt 2', responses: [['Response 2 Edward', 'Edward K. Chan'], ['Response 2 Sarah', 'Sarah Peterson'], ['Response 2 Jenny', 'Jenny Turner']], winner: 'Jenny Turner', stage: 2, ready: ['Edward K. Chan', 'Sarah Peterson', 'Jenny Turner']},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 1,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR2S0 = {
// 	gameName: 'Purple-Puma-Playing-Round-2-Stage-0',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 2, ready: []},
// 	{prompt: 'prompt 2', responses: [['Response 2 Edward', 'Edward K. Chan'], ['Response 2 Sarah', 'Sarah Peterson'], ['Response 2 Jenny', 'Jenny Turner']], winner: 'Jenny Turner', stage: 2, ready: []},
// 	{prompt: 'prompt 3', responses: [], winner: '', stage: 0, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 2,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR2S1 = {
// 	gameName: 'Purple-Puma-Playing-Round-2-Stage-1',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 2, ready: []},
// 	{prompt: 'prompt 2', responses: [['Response 2 Edward', 'Edward K. Chan'], ['Response 2 Sarah', 'Sarah Peterson'], ['Response 2 Jenny', 'Jenny Turner']], winner: 'Jenny Turner', stage: 2, ready: []},
// 	{prompt: 'prompt 3', responses: [['Response 3 Edward', 'Edward K. Chan'], ['Response 3 John', 'John Taylor'], ['Response 3 Jenny', 'Jenny Turner']], winner: '', stage: 1, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 2,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR2S2 = {
// 	gameName: 'Purple-Puma-Playing-Round-2-Stage-2',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 2, ready: []},
// 	{prompt: 'prompt 2', responses: [['Response 2 Edward', 'Edward K. Chan'], ['Response 2 Sarah', 'Sarah Peterson'], ['Response 2 Jenny', 'Jenny Turner']], winner: 'Jenny Turner', stage: 2, ready: []},
// 	{prompt: 'prompt 3', responses: [['Response 3 Edward', 'Edward K. Chan'], ['Response 3 John', 'John Taylor'], ['Response 3 Jenny', 'Jenny Turner']], winner: 'John Taylor', stage: 2, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 2,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR3S0 = {
// 	gameName: 'Purple-Puma-Playing-Round-3-Stage-0',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 2, ready: []},
// 	{prompt: 'prompt 2', responses: [['Response 2 Edward', 'Edward K. Chan'], ['Response 2 Sarah', 'Sarah Peterson'], ['Response 2 Jenny', 'Jenny Turner']], winner: 'Jenny Turner', stage: 2, ready: []},
// 	{prompt: 'prompt 3', responses: [['Response 3 Edward', 'Edward K. Chan'], ['Response 3 John', 'John Taylor'], ['Response 3 Jenny', 'Jenny Turner']], winner: 'John Taylor', stage: 2, ready: []},
// 	{prompt: 'prompt 4', responses: [], winner: '', stage: 0, ready: []}],
// 	currentRound: 3,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingR3S1 = {
// 	gameName: 'Purple-Puma-Playing-Round-3-Stage-1',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 2, ready: []},
// 	{prompt: 'prompt 2', responses: [['Response 2 Edward', 'Edward K. Chan'], ['Response 2 Sarah', 'Sarah Peterson'], ['Response 2 Jenny', 'Jenny Turner']], winner: 'Jenny Turner', stage: 2, ready: []},
// 	{prompt: 'prompt 3', responses: [['Response 3 Edward', 'Edward K. Chan'], ['Response 3 John', 'John Taylor'], ['Response 3 Jenny', 'Jenny Turner']], winner: 'John Taylor', stage: 2, ready: []},
// 	{prompt: 'prompt 4', responses: [['Response 4 Edward', 'Edward K. Chan'], ['Response 4 John', 'John Taylor'], ['Response 4 Sarah', 'Sarah Peterson']], winner: '', stage: 1, ready: []}],
// 	currentRound: 3,
// 	gameStage: 'playing'
// };

// module.exports.PurplePumaPlayingEndOfGame = {
// 	gameName: 'Purple-Puma-Playing-End-Of-Game',
// 	password: '',
// 	players: ['Edward K. Chan', 'John Taylor', 'Sarah Peterson', 'Jenny Turner'],
// 	rounds: [
// 	{prompt: 'prompt 1', responses: [['Response 1 John', 'John Taylor'], ['Response 1 Sarah', 'Sarah Peterson'], ['Response 1 Jenny', 'Jenny Turner']], winner: 'Sarah Peterson', stage: 2, ready: []},
// 	{prompt: 'prompt 2', responses: [['Response 2 Edward', 'Edward K. Chan'], ['Response 2 Sarah', 'Sarah Peterson'], ['Response 2 Jenny', 'Jenny Turner']], winner: 'Jenny Turner', stage: 2, ready: []},
// 	{prompt: 'prompt 3', responses: [['Response 3 Edward', 'Edward K. Chan'], ['Response 3 John', 'John Taylor'], ['Response 3 Jenny', 'Jenny Turner']], winner: 'John Taylor', stage: 2, ready: []},
// 	{prompt: 'prompt 4', responses: [['Response 4 Edward', 'Edward K. Chan'], ['Response 4 John', 'John Taylor'], ['Response 4 Sarah', 'Sarah Peterson']], winner: 'Sarah Peterson', stage: 2, ready: []}],
// 	currentRound: 3,
// 	gameStage: 'gameover'
// };