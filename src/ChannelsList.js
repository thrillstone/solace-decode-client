import React, { useState } from 'react';
import Channel from "./Channel";

function ChannelsList(props) {
  return (
    <div>
      <h1>Channels</h1>
      <div>
        {
          props.channels.map((channel) =>
              <Channel channel={channel} onChangeChannel={props.onChangeChannel} />
          )
        }
      </div>
    </div>
  );
}

export default ChannelsList;