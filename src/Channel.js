import "./Channel.css"
import React, { useState } from 'react';

function Channel(props) {
  const ChannelType = {
    hobbies: "Hobbies",
    social: "Social",
    work: "Work"
  }

  function handleClick() {
    props.onChangeChannel(props.channel)
  }

  return (
    <div onClick={handleClick} className={`Channel ${props.channel == props.selectedChannel ? "selected" : ""}`}>
      <div className="icon"></div>
      <div className="info">
        <div className="name">{props.channel.name}</div>
        <div className="sub-info">
          <div className="type">{ChannelType[props.channel.channelType]}</div>
          <div className="date">{props.channel.time}</div>
        </div>
      </div>
        
    </div>
  );
}

export default Channel;