'use strict';
import React from 'react';
import WaitingRoom from './WaitingRoom.jsx';
import PlayingGame from './PlayingGame.jsx';
import EndOfGame from './EndOfGame.jsx';
import $ from 'jquery';
import io from 'socket.io-client';
import { PageHeader } from 'react-bootstrap';

const socket = io();

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      game: null,
      username: null,
      time: null,
      response: false
    };

    this.getGameData = this.getGameData.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.leaveGame = this.leaveGame.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handlePromptSubmission = this.handlePromptSubmission.bind(this);
    this.handleJudgeSelection = this.handleJudgeSelection.bind(this);
    this.handleReadyToMoveOn = this.handleReadyToMoveOn.bind(this);
    
    socket.on('update waiting room', (gameObj) => {
      this.setState({game: gameObj});
    })
    socket.on('start game', (gameObj) => {
      this.setState({game: gameObj});
    })
    socket.on('prompt added', (gameObj) => {
      this.setState({game: gameObj});
    })
    socket.on('start judging', (gameObj) => {
      this.setState({game: gameObj});
    })
    socket.on('winner chosen', (gameObj) => {
      this.setState({game: gameObj});
    })
    socket.on('start next round', (gameObj) => {
      this.setState({game: gameObj});
    })
    socket.on('game over', (gameObj) => {
      this.setState({game: gameObj});
    })
    socket.on('disconnectTimeOut', () => {
      console.log('disconnectTimeOut')
      this.props.route.sendToLobby.call(this, true);
    })
    socket.on('timer', (data) => {
      this.setState({})
    })
  }

  componentDidMount() {
    // Get game name from the route url params
    // Sends GET request to current server
    this.getGameData(this.props.params.gamename);
    this.getUsername();
  }

  socketHandlers() {
    //TODO: check best practice for socket events
    // on 'start game', set game state to be data (game instance obj)

    // emit 'submit response', send response and gamename and username as data to that socket room

    // on 'start judging', set game state to new game instance obj data

    // emit 'judge selection', send username of winner, gamename

    // on 'winner chosen', update game state with new game instance obj

    // emit 'ready to move on', send username and gamename

    // on 'start next round', update game state with new game instance obj

    // on 'game over', update game state w/ new game instance obj
  }

  getGameData(gameName) {
    // use gameName to retrieve gameInstance obj of that game
    $.ajax({
      url: '/game',
      method: 'GET',
      headers: {'content-type': 'application/json'},
      data: {name: gameName},
      success: (data) => {
        this.setState({game: data[0]})
      },
      error: (err) => {
        console.log('error getting games: ', err);
      }
    });
  }

  getUsername() {
    $.ajax({
      url: '/username',
      method: 'GET',
      headers: {'content-type': 'application/json'},
      success: (username) => {
        this.setState({username: username}, function() {
          socket.emit('join game', {gameName: this.props.params.gamename, username: this.state.username});
        });
      },
      error: (err) => {
        console.log('error getting username', err);
      }
    });
  }

  leaveGame() {
    let currentPlayers = this.state.game.players.length;

    if (currentPlayers === 1) {
      let exitGameChoice = confirm('You are the only player. Are you sure you want to destroy this game?');

      if (exitGameChoice) {
        socket.emit('leave game', {gameName: this.props.params.gamename, username: this.state.username});
      }
    } else {
      socket.emit('leave game', {gameName: this.props.params.gamename, username: this.state.username});
    }
  }

  handleResponse(response) {
    if (!this.state.response) {
      socket.emit('submit response', {gameName: this.props.params.gamename, username: this.state.username, response: response});
      this.setState({response:!this.state.response})
    }
  }

  handleJudgeSelection(winner) {
    if (!this.state.response) {
      socket.emit('judge selection', {gameName: this.props.params.gamename, winner: winner});
      this.setState({response:!this.state.response})
    }
  }

  handleReadyToMoveOn() {
    if (!this.state.response) {
      socket.emit('ready to move on', {gameName: this.props.params.gamename, username: this.state.username});
    }
  }

  handlePromptSubmission(prompt) {
    socket.emit('prompt created', {gameName: this.props.params.gamename, prompt: prompt});
  }

  render() {
    return (
      <div id="game">
      <div> {this.state.time} </div>
        {this.state.game && this.state.username && this.state.game.gameStage === 'waiting' && <WaitingRoom time = {this.state.time} game={this.state.game} user={this.state.username} sendToLobby={this.props.route.sendToLobby} leaveGame={this.leaveGame} />}
        {this.state.game && this.state.username && this.state.game.gameStage === 'playing' && <PlayingGame time = {this.state.time} game={this.state.game} user={this.state.username} handleResponse={this.handleResponse} handlePromptSubmission={this.handlePromptSubmission} handleJudgeSelection={this.handleJudgeSelection} handleReadyToMoveOn={this.handleReadyToMoveOn}/>}
        {this.state.game && this.state.username && this.state.game.gameStage === 'gameover' && <EndOfGame game={this.state.game} sendToLobby={this.props.route.sendToLobby}/>}
      </div>
    )
  }
}

export default Game;