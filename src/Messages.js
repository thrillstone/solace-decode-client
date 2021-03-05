import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState } from 'react';
import Message from './Message'

function Messages(props) {
	const messaging = useContext(EventContext);
    const [connected, setConnected] = useState(false);
	
    const [messages, setMessages] = useState([{type: "message", id: 0, userId: 0, name: "Faraz", text: "Hello, world!", timestamp: "1:46 PM"}, {type: "message", id: 1, userId: 1, name: "World", text: "Hi, Faraz!", timestamp: "1:47 PM"}]);
	const [text, setText] = useState("")

	useEffect(() => {
		const setupMessaging = () => {
			messaging.connect()
			.then(() => {
				setConnected(true);
			})
			.catch(console.error);
			messaging.on("message", (event) => {
				messages.push(event);
				setMessages(messages);
			});
			messaging.subscribe(`channels/*/messages`);
		};
		setupMessaging();
	}, [messaging]);

	const publishMessage = () => {
		if (connected){
			messaging.publish(`channels/${props.selectedChannel.id}/messages`, {type: "message", id: 0, userId: 0, name: "Faraz", text: text, timestamp: "1:46 PM"});
		}
	}
	
	return (
		<div className="Messages">
            <div className="chat_body">
				{
					messages.map((message) =>
						<Message message={message} />
					)
				}
            </div>
			<div className="chat_footer">
				<div>
					<input className="chat_textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Send a message" />
				</div>
				<div>
					<button type="submit" disabled={!text} onClick={publishMessage}>↩️</button>
				</div>
            </div>
		</div>
	);
}

export default Messages;
