'use strict';
import React from 'react';
import GameList from './GameList.jsx';
import $ from 'jquery';
import CreateGame from './CreateGame.jsx';
import YourGames from './YourGames.jsx';
import PlayerDisconnected from './PlayerDisconnected.jsx'
import { Button, Form, FormGroup, Panel, ListGroup, ListGroupItem, Col, FormControl, ControlLabel, PageHeader } from 'react-bootstrap';
var Filter = require('bad-words');
var filter = new Filter();

// TODO: build logic to prevent users from joining a full game


class Lobby extends React.Component {
  constructor(props) {
    super(props)

    console.log(this.props);

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


    this.props.route.ioSocket.on('chat updated', messages => {
      this.setState({chatroom: messages});
      console.log('Current client side chat: ', this.state.chatroom);
    });

    this.props.route.ioSocket.on('user joined lobby', userList => {
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
    this.handleAddFriendByInputName = this.handleAddFriendByInputName.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.props.route.ioSocket.on('get games', (data) => {
      console.log(data.games);
      this.setState({games: data.games});
    });

    this.props.route.ioSocket.on('update games', (data) => {
      console.log(data.games);
      this.setState({games: data.games});
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
          this.props.route.ioSocket.emit('join lobby', {username: this.state.username});
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
    this.props.route.ioSocket.send({message: filter.clean(message), username: this.state.username});
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
      this.addToFriendList(event, this.state.username, false);
    } else {
      alert('Sorry, you can\'t add yourself.');
    }
  }

  addToFriendList(friend, currentUser, typedIn) {
    $.ajax({
      url: '/friends',
      method: 'POST',
      headers: {'content-type': 'application/json'},
      data: JSON.stringify({"friend": friend, "username": currentUser, "typedIn": typedIn}),
      success: (data) => {
        alert('Friend added!');
      },
      error: (err) => {
        if (err.responseText) {
          alert(err.responseText);
        } else {
          console.log('error adding friend', err);
        }
      }
    });
  }

  showFriendNameInput() {
    //toggle a flag here to showup the form
    this.setState( prevState => ({addFriend: !prevState.addFriend}));
  }

  handleAddFriendByInputName(event) {
    event.preventDefault();
    this.addToFriendList(this.state.friendName, this.state.username, true);
  }

  handleInputChange(event) {
    this.setState({friendName: event.target.value});
  }

  handleLogout() {
    console.log(this.state.username);
    let logoutFunc = this.props.route.sendToHomePage;
    this.props.route.ioSocket.emit('leave lobby', this.state);

    $.ajax({
      url: '/logout',
      method: 'GET',
      headers: {'content-type': 'application/json'},
      success: data => {
        console.log('handleLogout data: ', data);
        logoutFunc();
      },
      error: (err) => {
        console.log('error logging out: ', err);
      }
    });
  }

  render() {
    const currentGames = (
      <div>
        <h4>Current Games:</h4>
        {this.state.games && <GameList username={this.state.username} games={this.state.games} sendToGame={this.props.route.sendToGame} />}
      </div>
    );

    let mainPanel = currentGames;
    if (this.state.private === 1) {
      mainPanel = <CreateGame username={this.state.username} sendToGame={this.props.route.sendToGame} private={false} handlePrivateState={this.handlePrivateState}/>;
    } else if (this.state.private === -1) {
      mainPanel = <CreateGame username={this.state.username} sendToGame={this.props.route.sendToGame} private={true} handlePrivateState={this.handlePrivateState}/>;
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
      <Button type="submit" onClick={this.handleAddFriendByInputName}>Add</Button>
      </Form>
    );


    return (
      <Col id="lobby" sm={6} smOffset={3}>
        <PageHeader>Lobby for {this.state.username} {  }<Button onClick={this.handleLogout}>Logout</Button></PageHeader>
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
