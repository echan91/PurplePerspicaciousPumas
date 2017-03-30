'use strict';
import React from 'react';
import Prompt from './PlayingGameComponents/Prompt.jsx';
import CurrentJudge from './PlayingGameComponents/CurrentJudge.jsx';
import PlayersResponding from './PlayingGameComponents/PlayersResponding.jsx';
import SeeResponses from './PlayingGameComponents/SeeResponses.jsx';
import Winner from './PlayingGameComponents/Winner.jsx'
import RespondToPrompt from './PlayingGameComponents/RespondToPrompt.jsx';
import ChooseWinner from './PlayingGameComponents/ChooseWinner.jsx';
import Score from './PlayingGameComponents/Score.jsx';
import CreatePrompt from './PlayingGameComponents/CreatePrompt.jsx';
import JudgeCreatingPrompt from './PlayingGameComponents/JudgeCreatingPrompt.jsx';
import { Col, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';


class PlayingGame extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      role: null // can either be judge or player
    };

    this.getRole = this.getRole.bind(this);
  }

  componentDidMount() {
    this.getRole();
  }

  componentWillReceiveProps(nextProps) {
    this.getRole(nextProps);
  }

  getRole(nextProps) {

    if (nextProps) {
      let curRound = nextProps.game.currentRound;
      
      if (nextProps.game.players[curRound] === nextProps.user) {
        this.setState({role: 'judge'})
      } else {
        this.setState({role: 'player'})
      }
    } else {
      let curRound = this.props.game.currentRound;
      
      if (this.props.game.players[curRound] === this.props.user) {
        this.setState({role: 'judge'})
      } else {
        this.setState({role: 'player'})
      }
    }
  }

  render() {
    var curRound = this.props.game.currentRound;
    var curPrompt = this.props.game.rounds[curRound].prompt;
    var curJudge = this.props.game.players[curRound];
    var stage = this.props.game.rounds[curRound].stage;
    var responses = this.props.game.rounds[curRound].responses;
    var winner = this.props.game.rounds[curRound].winner;

    return (
      <Col id="playing-game">
        <PageHeader>{this.props.game.gameName}: <small>Round {this.props.game.currentRound + 1} - Judge: {curJudge}</small></PageHeader>
          <Col sm={6} smOffset={3}>
            <h4>Scoreboard</h4>
            <Score game={this.props.game}/>
          </Col>
          <Col sm={6} smOffset={3}>
            {stage !== -1 && <Prompt prompt={curPrompt}/>}
          </Col>
        <Col sm={6} smOffset={3}>
        {stage === -1 && this.state.role === 'judge' && <CreatePrompt time={this.props.time} handlePromptSubmission={this.props.handlePromptSubmission}/>}
        {stage === -1 && this.state.role === 'player' && <JudgeCreatingPrompt time={this.props.time} judge={curJudge}/>}
        {stage === 0 && this.state.role === 'judge' && <PlayersResponding time={this.props.time} />}
        {stage === 0 && this.state.role === 'player' && <RespondToPrompt time={this.props.time} handleResponse={this.props.handleResponse}/>}
        {stage === 1 && this.state.role === 'judge' && <ChooseWinner time={this.props.time} responses={responses} handleJudgeSelection={this.props.handleJudgeSelection}/>}
        {stage === 1 && this.state.role === 'player' && <SeeResponses time={this.props.time} responses={responses}/>}
        {stage === 2 && <Winner time={this.props.time} responses={responses} winner={winner} handleReadyToMoveOn={this.props.handleReadyToMoveOn}/>}
        </Col>
      </Col>
    )
  }
}

export default PlayingGame;