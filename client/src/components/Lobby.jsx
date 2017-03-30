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
    super(props);
    this.state = {
      games: null,
      username: null,
      private: 0
    };

    this.getGames = this.getGames.bind(this);
    this.handleGameCreationChoice = this.handleGameCreationChoice.bind(this);
    this.handlePrivateState = this.handlePrivateState.bind(this);
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
        });
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

  render() {
   const currentGames = (
    <div>
      <h4>Current Games:</h4>
      {this.state.games && <GameList games={this.state.games} sendToGame={this.props.route.sendToGame} />}
    </div>);

   let mainPanel = currentGames;
   if (this.state.private === 1) {
    mainPanel = <CreateGame sendToGame={this.props.route.sendToGame} private={false} handlePrivateState={this.handlePrivateState}/> ;
   } else if(this.state.private === -1) {
    mainPanel = <CreateGame sendToGame={this.props.route.sendToGame} private={true} handlePrivateState={this.handlePrivateState}/>;

   }

    return (

      <Col id="lobby" sm={6} smOffset={3}>
        <PageHeader>Lobby</PageHeader>
        {this.props.params.disconnectTimeOut && <PlayerDisconnected/>}
        <Button onClick={this.handleGameCreationChoice} value="ordinary">Start a New Game</Button> {   }
        <Button onClick={this.handleGameCreationChoice} value="private">Start a New Private Game</Button>
        
        {mainPanel}

      </Col>
      
    )
  }
}
export default Lobby;
//previously in return statement:
// {this.state.games && <YourGames games={this.state.games} username={this.state.username} sendToGame={this.props.route.sendToGame}/>}