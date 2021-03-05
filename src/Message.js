import React, { useState } from 'react';
import './App.css'

function Message(props) {
  return (
    <div className="message">
        <div>
            <span className="messageName">{props.message.name}</span>
            <span className="messageTime">{props.message.timestamp}</span>
        </div>
        <p className="messageText">{props.message.text}</p>
    </div>
  );
}

export default Message;