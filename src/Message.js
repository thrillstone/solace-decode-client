import React, { useState } from 'react';
import './App.css'

function Message(props) {
  return (
    <div className="message">
        <img className="messageImage" src="https://st.depositphotos.com/1779253/5140/v/600/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg"></img>
        <div>
            <span className="messageName">{props.message.name}</span>
            <span className="messageTime">{props.message.timestamp}</span>
        </div>
        <p className="messageText">{props.message.text}</p>
    </div>
  );
}

export default Message;