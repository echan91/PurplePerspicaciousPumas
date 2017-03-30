'use strict';
import React from 'react';
import GameList from './GameList.jsx';
import $ from 'jquery';
import CreateGame from './CreateGame.jsx';
import YourGames from './YourGames.jsx';
import PlayerDisconnected from './PlayerDisconnected.jsx'
import { Button, Form, FormGroup, Col, FormControl, ControlLabel, PageHeader } from 'react-bootstrap';
import io from 'socket.io-client';
const socket = io();

//TODO:
  // build logic to prevent users from joining a full game

class Lobby extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      games: null,
      username: null,
      timer: null
    }
    this.getGames = this.getGames.bind(this);
    socket.on('timer', (data) => {
      this.setState({
        timer: data.time
      })
    })
  }

  componentDidMount() {
    this.getGames();
    this.getUsername();
    socket.emit('testing', {'time':5});
  }

  getGames() {
    $.ajax({
      url: '/games',
      method: 'GET',
      headers: {'content-type': 'application/json'},
      success: (data) => {
        console.log('got games: ', data);
        this.setState({
          games: data
        })
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
        this.setState({username: username})
      },
      error: (err) => {
        console.log('error getting username', err);
      }
    });
  }

  render() {
    if (this.state.timer === 0) {
      socket.emit('testing',{'time':5})
    }
    return (

      <Col id="lobby" sm={6} smOffset={3}>
        <div> {this.state.timer} </div>
        <PageHeader>Lobby</PageHeader>
        {this.props.params.disconnectTimeOut && <PlayerDisconnected/>}
        <CreateGame sendToGame={this.props.route.sendToGame}/>
        {this.state.games && <YourGames games={this.state.games} username={this.state.username} sendToGame={this.props.route.sendToGame}/>}
        <h4>Current Games:</h4>
        {this.state.games && <GameList games={this.state.games} sendToGame={this.props.route.sendToGame}/>}
      </Col>

    )
  }
}
export default Lobby;