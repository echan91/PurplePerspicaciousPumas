'use strict';
import React from 'react';
import GameList from './GameList.jsx';
import $ from 'jquery';
import CreateGame from './CreateGame.jsx';
import YourGames from './YourGames.jsx';
import PlayerDisconnected from './PlayerDisconnected.jsx'
import { Button, Form, FormGroup, Col, FormControl, ControlLabel, PageHeader } from 'react-bootstrap';
var hostUrl = process.env.LIVE_URL || 'http://localhost:3000/';

//TODO:
  // build logic to prevent users from joining a full game

class Lobby extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      games: null,
      username: null
    }
    this.getGames = this.getGames.bind(this);
  }

  componentDidMount() {
    this.getGames();
    this.getUsername();
  }

  getGames() {
    $.ajax({
      url: hostUrl + 'games',
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
      url: hostUrl + 'username',
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
    return (

      <Col id="lobby" sm={6} smOffset={3}>
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