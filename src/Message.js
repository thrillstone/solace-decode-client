import React, { useState } from 'react';
import './App.css'

function Message(props) {
  return (
    <div className="message">
        <div className="icon"></div>
        <div class="content">
          <div>
            <span className="messageName">{props.message.name}</span>
            <span className="messageTime">{props.message.timestamp}</span>
          </div>
          <div className="messageText">{props.message.text}</div>
        </div>
    </div>
  );
}

export default Message;