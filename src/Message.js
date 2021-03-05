import React, { useState } from 'react';
import './App.css'

function Message(props) {

  const toTime = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    let am = "AM";
    let hours = date.getHours();
    if (hours > 12) {
      hours -= 12;
      am = "PM";
    }
    
    return `${hours}:${date.getMinutes()} ${am}`;
  }

  return (
    <div className="message">
        <img className="messageImage" src="https://st.depositphotos.com/1779253/5140/v/600/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg"></img>
        <div className="content">
        <div>
            <span className="messageName">{props.message.name}</span>
            <span className="messageTime">{toTime(props.message.timestamp)}</span>
          </div>
          <div className="messageText">{props.message.text}</div>
        </div>
    </div>
  );
}

export default Message;