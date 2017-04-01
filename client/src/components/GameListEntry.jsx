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
  	room = (<b>*(Private) {room}</b>);
  }

  return (
    <ListGroupItem header={room} onClick={() => {
    	if (props.game.password) {
	    	let pass = prompt('Please enter room password: ');
	    	while(pass !== null && pass !== props.game.password) {
	    	    pass = prompt('Please enter room password: ');
	    	}
	    	if(pass !== null) {
		    	props.sendToGame(props.name);
	    	}
    	} else {
	    	props.sendToGame(props.name);
	    }
	}}>
    	<em>Prompt Type:</em> {promptType} | <em>Current Players:</em> {playerList}
    </ListGroupItem>
  )
}


export default GameListEntry;
