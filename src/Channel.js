import React, { useState } from 'react';

function Channel(props) {

  function handleClick() {
    props.onChangeChannel(props.channel)
  }

  return (
    <div onClick={handleClick} class="channel">
        {props.channel.name}
    </div>
  );
}

export default Channel;