'use strict';
import React from 'react';
import { Col, Panel } from 'react-bootstrap';

const GameWinner = (props) => {

  let rounds = props.game.rounds;
  let roundWinners = {};

  rounds.forEach(function(round) {
    if(round.winner.length >= 1) {
      roundWinners[round.winner] ? roundWinners[round.winner]++ : roundWinners[round.winner] = 1;
    }
  });


  let gameWinner = [];

  for (var winner in roundWinners) {
    var currentWinner = roundWinners[gameWinner[0]] || 0;

    if (roundWinners[winner] > currentWinner) {
      gameWinner = [winner];
    } else if (roundWinners[winner] === currentWinner) {
      gameWinner.push(winner);
    } 
  }

  let winnerMessage = '';

  if (gameWinner.length === 1) {
    winnerMessage = 'the winner: ' + gameWinner[0];
  } else {
    winnerMessage += 'the winners: ',
    gameWinner.forEach(function(winner, index) {
      index === gameWinner.length - 1 ? (winnerMessage += winner) : winnerMessage += winner + ', ';
    })
  }

  console.log(winnerMessage);

  return (
    <Col id="GameWinner">
      <Panel header="Winner">
        <b>Congrats to {winnerMessage}!</b>
      </Panel>
      <br />
    </Col>
  )
}


export default GameWinner;