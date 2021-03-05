import "./Channel.css"
import React, { useState } from 'react';

function Channel(props) {

  function handleClick() {
    props.onChangeChannel(props.channel)
  }

  return (
    <div onClick={handleClick} className={`Channel ${props.channel.selected ? "selected" : ""}`}>
      <div className="icon"></div>
      <div className="info">
        <div className="name">{props.channel.name}</div>
        <div className="sub-info">
          <div className="type">Private Conversation</div>
          <div className="date">7:01PM</div>
        </div>
      </div>
        
    </div>
  );
}

export default Channel;