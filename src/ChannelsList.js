import React, { useState } from 'react';
import Channel from "./Channel";

function ChannelsList(props) {
  return (
    <div class="channels-list">
      <h3>Channels</h3>
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