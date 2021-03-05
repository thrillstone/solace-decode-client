import "./Messages.css";
import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState } from 'react';
import Message from './Message'
import './App.css'

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
  }

function Messages(props) {
	const messaging = useContext(EventContext);
	
	const [messages, setMessages] = useState([{type: "message", channelId: 0, id: 0, userId: 0, name: "Faraz", text: "Hello, world! This is a really long message. This is a really long message. This is a really long message. This is a really long message. This is a really long message. This is a really long message.", timestamp: "1:46"}, {type: "message", channelId: 0, id: 1, userId: 1, name: "World", text: "Hi, Faraz! https://www.reddit.com/r/all/", timestamp: "1:47"}]);
	const [text, setText] = useState("")

	useEffect(() => {
		const setupMessaging = () => {
			messaging.on("message", (event) => {
				console.log(event, props.channel)
				if (event.channelId === props.channel?.id) {
					messages.push(event);
					setMessages([...messages]);
				}
			});
		};
		setupMessaging();
	}, [messaging]);

	useEffect(() => {
		if (props.channel) {
			console.log("Subscribing to channel", props.channel)
			messaging.subscribe(`channels/${props.channel.id}/messages`);
		}
	}, [props.channel]);

	const publishMessage = () => {
		if (props.channel) {
			console.log("Publishing to channel", props.channel)
			messaging.publish(`channels/${props.channel.id}/messages`, {type: "message", channelId: props.channel.id, id: uuidv4(), userId: 0, name: "Faraz", text: text, timestamp: "1:46 PM"});
		}
	}

	return (
		<div className="Messages">
			<div className="chat_body">
				{
					messages.map((message) =>
						<Message key={message.id} message={message} />
					)
				}
			</div>
			<div className="chat_footer">
				<div className="chat_textbox">
					<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Send a message" />
					<button type="submit" disabled={!text} onClick={publishMessage}>↩️</button>
				</div>
			</div>
		</div>
	);
}

export default Messages;
