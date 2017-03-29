'use strict';
import React from 'react';
import $ from 'jquery';
import { DropdownButton, MenuItem, Button, Form, FormGroup, Col, FormControl, ControlLabel, PageHeader, Radio } from 'react-bootstrap';
var Filter = require('bad-words');
var filter = new Filter();

var hostUrl = process.env.LIVE_URL || 'http://localhost:3000/';

class CreateGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameName: '',
      promptType: 'random',
      error: false,
      roomType: 'ordinary'
    };
    this.handleChange = this.handleChange.bind(this);
    this.addGameToDB = this.addGameToDB.bind(this);
    this.handlePromptTypeSelection = this.handlePromptTypeSelection.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  handleChange(event) {
    var filteredGameName = filter.clean(event.target.value)
    this.setState({gameName: filteredGameName});
  }

  addGameToDB(gameName, promptType, callback) {
    var initialStage = promptType === 'random' ? 0 : -1;

    var gameInstance = {
      gameName: gameName,
      password: '',
      players: [],
      rounds: [
      {prompt: 'prompt 1', responses: [], winner: '', stage: initialStage, ready: []}, 
      {prompt: 'prompt 2', responses: [], winner: '', stage: initialStage, ready: []}, 
      {prompt: 'prompt 3', responses: [], winner: '', stage: initialStage, ready: []}, 
      {prompt: 'prompt 4', responses: [], winner: '', stage: initialStage, ready: []}],
      currentRound: 0
    }

    $.ajax({
      url: hostUrl + 'games',
      method: 'POST',
      headers: {'content-type': 'application/json'},
      data: JSON.stringify(gameInstance),
      success: (data) => {
        callback(gameName);
      },
      error: (err) => {
        console.log('error in login POST: ', err);
        this.setState({
          error: true
        })
      }
    });
  }

  handlePromptTypeSelection(promptType) {
    this.setState({promptType: promptType});
  }

  handleOptionChange(changeEvent) {
    this.setState({roomType : changeEvent.target.value});
  }


  render() {

    const errorMessage = <p><b>That game name has already been taken. Please try again with a different game name!</b></p>
    let password = null;
    if(this.state.roomType === 'private') {
      //fill in onChange = {}
      password = <input placeholder="Room password" type="password" /> ;
    }
    //<FormGroup>
      //    <Radio checked inline onClick={this.handleCreateOrdinaryRoom}>Orinary Room</Radio>
       //   <Radio inline onClick={this.handleCreatePrivateRoom}>Passowrd protected Room</Radio>
       // </FormGroup>

    return (
      <div id="create-game">
        <h4>Start a New Game</h4>
          <form>
          <label>
            <input type="radio" value="ordinary" checked={this.state.roomType==='ordinary'} onChange={this.handleOptionChange}/>Orindary room 
          </label>
          <label>
            <input type="radio" value="private" checked={this.state.roomType==='private'} onChange={this.handleOptionChange} />Password protected room
          </label>
          </form>
          {this.state.error && errorMessage}

          <input placeholder="Name your game..." type="text" value={this.state.gameName} onChange={this.handleChange} />
          {password}
          <DropdownButton bsSize="small" title='Prompt-Type' id='0'>
            <MenuItem eventKey="1" onSelect={() => this.handlePromptTypeSelection('random')}>Random</MenuItem>
            <MenuItem eventKey="2" onSelect={() => this.handlePromptTypeSelection('user-generated')}>User-generated</MenuItem>
          </DropdownButton>
          <Button bsSize="small" onClick={() => this.addGameToDB(this.state.gameName, this.state.promptType, this.props.sendToGame)}>Submit</Button>
      </div>
    )
  }
}
export default CreateGame;