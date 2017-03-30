import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import SignUp from './components/SignUp.jsx';
import { Router, Route, hashHistory } from 'react-router';
import Lobby from './components/Lobby.jsx';
import Home from './components/Home.jsx';
import Game from './components/Game.jsx';
// import io from 'socket.io-client';

class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {}

      this.sendToGame = this.sendToGame.bind(this);
      this.sendToLobby = this.sendToLobby.bind(this);
      this.sendToCreateGame = this.sendToCreateGame.bind(this);
    }

    sendToLobby(disconnectTimeOut) {
      if (disconnectTimeOut) {
        hashHistory.push('/lobby/:disconnectTimeOut');
      } else {
        hashHistory.push('/lobby');
      }
    }

    sendToGame(gameName) {
      hashHistory.push(/game/ + gameName);
    }

    sendToCreateGame() {
      hashHistory.push('/createGame');
    }

    render() {
      return (
        <div>
          <Router history={hashHistory}>
            <Route path="/" component={Home} sendToLobby={this.sendToLobby} handleSignUp={this.handleSignUp} handleLogIn={this.handleLogIn} />
            <Route path="/lobby" component={Lobby} sendToGame={this.sendToGame} disconnectTimeOut={this.state.disconnectTimeOut} sendToCreateGame={this.sendToCreateGame} />
            <Route path="/lobby/:disconnectTimeOut" component={Lobby} sendToGame={this.sendToGame} disconnectTimeOut={this.state.disconnectTimeOut} />
            <Route path="/game/:gamename" component={Game} sendToLobby={this.sendToLobby}/>
          </Router>
        </div>
      );
    }
}
  //   <SignUp onSubmit={this.handleSignUp}/>
// import CreateGame from './components/CreateGame.jsx';
  // <Route path="/createGame" component={CreateGame} sendToLobby={this.sendToLobby} sendToGame={this.sendToGame}/>


ReactDOM.render(
  <App/>,
  document.getElementById('app')
);

