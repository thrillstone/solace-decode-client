import React, { useState } from 'react';
import image1 from "./avatars/1.png";
import image2 from "./avatars/2.png";
import image3 from "./avatars/3.png";
import image4 from "./avatars/4.png";
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
    
    return `${hours}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} ${am}`;
  }

  const image = (avatar) => {
    console.log(props.message, "message");
    if (avatar == 1) {
      return image1;
    } else if (avatar == 2) {
      return image2;
    } else if (avatar == 3) {
      return image3;
    } else {
      return image4;
    }
  }

  const linkify = (text) => {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, url => `<a href="${url}">${url}</a>`);
  }

  return (
    <div className="message">
        <img className="messageImage" src={image(props.message.avatar)}></img>
        <div className="content">
        <div>
            <span className="messageName">{props.message.name}</span>
            <span className="messageTime">{toTime(props.message.timestamp)}</span>
          </div>
          <div className="messageText" dangerouslySetInnerHTML={{__html: linkify(props.message.text)}}/>
        </div>
    </div>
  );
}

export default Message;