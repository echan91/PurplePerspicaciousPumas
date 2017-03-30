'use strict';
import React from 'react';
import { ListGroupItem } from 'react-bootstrap';

const GameListEntry = (props) => {

  var playerList = '';

  props.game.players.forEach(function(player) {
    playerList += (player + ', ');
  })

  let promptType = props.game.rounds[0].stage === 0 ? 'Random' : 'User-Generated';

  let room = props.name;
  if (props.game.password) {
  	room = (<b>private {room}</b>);
  }

  return (
  	<div>
    <ListGroupItem header={room} onClick={() => props.sendToGame(props.name)}><em>Prompt Type:</em> {promptType} | <em>Current Players:</em> {playerList}</ListGroupItem>
    </div>
  )
}


export default GameListEntry;