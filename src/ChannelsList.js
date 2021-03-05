import './ChannelList.css';
import React from 'react';
import Channel from "./Channel";

function ChannelsList(props) {
  return (
    <div className="ChannelList">
      <h3><span>Channels</span><div className="button" onClick={props.onNewChannel}>+</div></h3>
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