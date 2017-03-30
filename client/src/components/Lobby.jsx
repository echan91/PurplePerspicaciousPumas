'use strict';
import React from 'react';
import GameList from './GameList.jsx';
import $ from 'jquery';
import io from 'socket.io-client';
import CreateGame from './CreateGame.jsx';
import YourGames from './YourGames.jsx';
import PlayerDisconnected from './PlayerDisconnected.jsx'
import { Button, Form, FormGroup, Panel, ListGroup, ListGroupItem, Col, FormControl, ControlLabel, PageHeader } from 'react-bootstrap';

// TODO: build logic to prevent users from joining a full game
// CHAT object stub:
// let message = {
//   username:
//   message:
//   timestamp:
// }

const lobbyChat = io();

class Lobby extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      games: null,
      username: null,
      chatroom: [],
      lobbyUsers: [],
      value: ''
    }
    this.getGames = this.getGames.bind(this);
    this.sendMessageToChatroom = this.sendMessageToChatroom.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);

    lobbyChat.on('chat updated', messages => {
      this.setState({chatroom: messages});
      console.log('Current client side chat: ', this.state.chatroom);
    });

    lobbyChat.on('user joined lobby', userList => {
      console.log(userList);
      this.setState({lobbyUsers: userList});
      console.log('Current lobby users: ', this.state.lobbyUsers);
    });
  }

  componentDidMount() {
    this.getGames();
    this.getUsername();
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
        });
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
          lobbyChat.emit('join lobby', {username: this.state.username});
        });
      },
      error: (err) => {
        console.log('error getting username', err);
      }
    });
  }

  handleMessageChange(event) {
    this.setState({value: event.target.value});
    console.log(this.state.value);
  }

  sendMessageToChatroom(message) {
    lobbyChat.send({message: message, username: this.state.username});
    this.setState({value: ''});
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
        <input placeholder="Type here..." value={this.state.value} onChange={this.handleMessageChange}/>
        <button onClick={() => this.sendMessageToChatroom(this.state.value)}>Send</button>

        <Panel header="Users in Chat" bsStyle="primary">
          {this.state.lobbyUsers.map(user => <p>{user}</p>)}
        </Panel>
        <Panel header="Lobby Chat" bsStyle="primary">
          {this.state.chatroom.map(message => <p>{message.username}: {message.message}</p>)}
        </Panel>
      </Col>

    )
  }
}
export default Lobby;