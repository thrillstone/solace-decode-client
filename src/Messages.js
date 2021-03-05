import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState } from 'react';
import Message from './Message'
import './App.css'

function Messages(props) {
	const messaging = useContext(EventContext);
    const [connected, setConnected] = useState(false);
	
    const [messages, setMessages] = useState([{type: "message", id: 0, userId: 0, name: "Faraz", text: "Hello, world! This is a really long message. This is a really long message. This is a really long message. This is a really long message. This is a really long message. This is a really long message.", timestamp: "1:46"}, {type: "message", id: 1, userId: 1, name: "World", text: "Hi, Faraz! https://www.reddit.com/r/all/", timestamp: "1:47"}]);
	const [text, setText] = useState("")
	
	function publishMessage() {
		setMessages(messages.concat({type: "message", id: 0, userId: 0, name: "Faraz", text: text, timestamp: "1:46"}))
	}

	return (
		<div>
            <div className="chat_body">
				{
					messages.map((message) =>
						<Message message={message} />
					)
				}
            </div>
			<div className="chat_footer">
				<div className="chat_textbox">
					<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Send a message" />
					{/* <button type="submit" disabled={!text} onClick={publishMessage}>↩️</button> */}
				</div>
            </div>
		</div>
	);
}

export default Messages;
