'use strict';
import React from 'react';
import GameList from './GameList.jsx';
import $ from 'jquery';
import io from 'socket.io-client';
import CreateGame from './CreateGame.jsx';
import YourGames from './YourGames.jsx';
import PlayerDisconnected from './PlayerDisconnected.jsx'
import { ButtonToolbar, Button, Form, FormGroup, Panel, ListGroup, ListGroupItem, Col, FormControl, ControlLabel, PageHeader } from 'react-bootstrap';


// TODO: build logic to prevent users from joining a full game
const lobbyChat = io();

class Lobby extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      games: null,
      username: null,
      chatroom: [],
      lobbyUsers: [],
      value: '',
      private: 0,
      addFriend: false,
      friendName: ''
    };

    lobbyChat.on('chat updated', messages => {
      this.setState({chatroom: messages});
      console.log('Current client side chat: ', this.state.chatroom);
    });

    lobbyChat.on('user joined lobby', userList => {
      console.log(userList);
      this.setState({lobbyUsers: userList});
      console.log('Current lobby users: ', this.state.lobbyUsers);
    });

    this.getGames = this.getGames.bind(this);
    this.sendMessageToChatroom = this.sendMessageToChatroom.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleGameCreationChoice = this.handleGameCreationChoice.bind(this);
    this.handlePrivateState = this.handlePrivateState.bind(this);
    this.showFriendNameInput = this.showFriendNameInput.bind(this);
    this.handleAddFriendByName = this.handleAddFriendByName.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

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
  }

  sendMessageToChatroom(message) {
    lobbyChat.send({message: message, username: this.state.username});
    this.setState({value: ''});
  }

  handleGameCreationChoice(event) {
    if(event.target.value === "ordinary") {
      this.setState({private: 1});
    } else if(event.target.value === "private") {
      this.setState({private : -1});
    }
  }

  handlePrivateState() {
    this.setState({private: 0});
  }

  handleAddFriendByClick(event) {
    if (event !== this.state.username) {
      this.addToFriendList(event, this.state.username);
    } else {
      alert('Sorry, you can\'t add yourself.');
    }
  }

  addToFriendList(friend, currentUser, fromInput) {
    $.ajax({
      url: '/friends',
      method: 'POST',
      headers: {'content-type': 'application/json'},
      data: JSON.stringify({"friend": friend, "username": currentUser}),
      success: (data) => {
        console.log('friend added!');
      },
      error: (err) => {
        console.log('error adding friend', err);
      }
    });
  }

  showFriendNameInput() {
    //toggle a flag here to showup the form
    this.setState( prevState => ({addFriend: !prevState.addFriend}));
  }
  //herer!!!
  handleAddFriendByName(event) {
    event.preventDefault();
    this.addToFriendList(this.state.friendName, this.state.username, true);
    console.log(this.state.friendName);

  }

  handleInputChange(event) {
    this.setState({friendName: event.target.value});
    console.log(this.state.friendName);
  }

  render() {
    const currentGames = (
      <div>
        <h4>Current Games:</h4>
        {this.state.games && <GameList games={this.state.games} sendToGame={this.props.route.sendToGame} />}
      </div>
    );

    let mainPanel = currentGames;
    if (this.state.private === 1) {
      mainPanel = <CreateGame sendToGame={this.props.route.sendToGame} private={false} handlePrivateState={this.handlePrivateState}/>;
    } else if (this.state.private === -1) {
      mainPanel = <CreateGame sendToGame={this.props.route.sendToGame} private={true} handlePrivateState={this.handlePrivateState}/>;
    }

    let header = (<span>
      <span>Users in Chat</span>
      {"    "}
      <Button bsSize="xsmall" bsStyle="info" onClick={this.showFriendNameInput}>Add a friend by name
      </Button>
    </span>);

    let addFriend = (
      <Form inline>
        <FormControl type="text" placeholder="Edward" onChange={this.handleInputChange} />
      <Button type="submit" onClick={this.handleAddFriendByName}>Add</Button>
      </Form>
    );


    return (
      <Col id="lobby" sm={6} smOffset={3}>
        <PageHeader>Lobby</PageHeader>
        <Button onClick={this.handleGameCreationChoice} value="ordinary">Start a New Game</Button> {   }
        <Button onClick={this.handleGameCreationChoice} value="private">Start a New Private Game</Button>
        {mainPanel}

        <input placeholder="Type here..." value={this.state.value} onChange={this.handleMessageChange}/>
        <button onClick={() => this.sendMessageToChatroom(this.state.value)}>Send</button>
        {"             "}
        <Panel header={header} bsStyle="primary">
          {this.state.lobbyUsers.map(user => (<div><span>{user}</span> <Button value={user} onClick={() => this.handleAddFriendByClick(user)} >Add friend</Button></div>))}
          {this.state.addFriend ? addFriend : null}
        </Panel>
        <Panel header="Lobby Chat" bsStyle="primary">
          {this.state.chatroom.map(message => <p>{message.username}: {message.message}</p>)}
        </Panel>

      </Col>

    )
  }
}

export default Lobby;