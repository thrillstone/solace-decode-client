import React, { useState } from 'react';

function Channel(props) {

  function handleClick() {
    props.onChangeChannel(props.channel)
  }

  return (
    <div onClick={handleClick} className="channel">
        {props.channel.name}
    </div>
  );
}

export default Channel;