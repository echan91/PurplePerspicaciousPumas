'use strict';
import React from 'react';
import $ from 'jquery';
import { DropdownButton, MenuItem, Button, Form, FormGroup, Col, FormControl, ControlLabel, PageHeader} from 'react-bootstrap';
var Filter = require('bad-words');
var filter = new Filter();

class CreateGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameName: '',
      promptType: 'random',
      error: false,
      roomType: 'ordinary',
      password:"",
      confirmPassword: ""
    };

    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.addGameToDB = this.addGameToDB.bind(this);
    this.handlePromptTypeSelection = this.handlePromptTypeSelection.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
  }

  handlePasswordChange(event) {
    this.setState({password : event.target.value});
  }

  handleConfirmPassword(event) {
    this.setState({confirmPassword : event.target.value});
  }

  validatePassword(oldPass, confPass) {
    console.log(oldPass === confPass);
    return oldPass === confPass;
  }

  handleGameNameChange(event) {
    let filteredGameName = filter.clean(event.target.value);
    this.setState({gameName: filteredGameName});
  }

  addGameToDB(gameName, password, promptType, callback) {
    let initialStage = promptType === 'random' ? 0 : -1;

    let gameInstance = {
      gameName: gameName,
      password: password,
      players: [],
      rounds: [
      {prompt: 'prompt 1', responses: [], winner: '', stage: initialStage, ready: []},
      {prompt: 'prompt 2', responses: [], winner: '', stage: initialStage, ready: []},
      {prompt: 'prompt 3', responses: [], winner: '', stage: initialStage, ready: []},
      {prompt: 'prompt 4', responses: [], winner: '', stage: initialStage, ready: []}],
      currentRound: 0
    }

    $.ajax({
      url: '/games',
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
        });
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
    if(this.props.private) {
      password = (
        <span>
        <input placeholder="Room password" type="password" id="password" onChange={this.handlePasswordChange} required={true}/>
        <br />
        <br />
        <input placeholder="Confirm password" type="password" id="confirm_password" onChange={this.handleConfirmPassword} required={true}/>
        </span>) ;
    }

    return (
      <div id="create-game">
          {this.state.error && errorMessage}
          <br/>
        <form>
        <FormGroup>
          <Col>
            <input type="text" placeholder="Name your game..." onChange={this.handleGameNameChange} value={this.state.gameName}/>
          </Col>
        </FormGroup>

        <FormGroup>
            <Col>
              {password}
            </Col>
        </FormGroup>

        <DropdownButton bsSize="small" title="Prompt-Type" id="0">
          <MenuItem eventKey="1" onSelect={() => this.handlePromptTypeSelection('random')}>Random</MenuItem>
          <MenuItem eventKey="2" onSelect={() => this.handlePromptTypeSelection('user-generated')}>user-generated</MenuItem>
        </DropdownButton>
        <br />
        <br />
        <Button bsSize="small" onClick={() => {

          if (this.validatePassword(this.state.password,
            this.state.confirmPassword)) {
            this.addGameToDB(this.state.gameName, this.state.password, this.state.promptType, this.props.sendToGame);
          } else {
            alert('Please enter the same password!');
          }
          }}>Submit</Button>
        {"       "}
        <Button bsSize="small" onClick={() => this.props.handlePrivateState()}>Cancel</Button>
      </form>
      </div>
    )
  }
}
export default CreateGame;
//replace the silly string spacing
