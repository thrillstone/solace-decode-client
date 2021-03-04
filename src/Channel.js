import React, { useState } from 'react';

function Channel(props) {

  function handleClick() {
    props.onChangeChannel(props.channel)
  }

  return (
    <div onClick={handleClick}>
        <h2>{props.channel.name}</h2>
    </div>
  );
}

export default Channel;