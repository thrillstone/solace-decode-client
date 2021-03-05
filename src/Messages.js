import "./Messages.css";
import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState, useRef } from 'react';
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
	
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");
	const [currentChannel, setCurrentChannel] = useState(props.channel);
	const channelRef = useRef();
	channelRef.current = props.channel;

	const receiveMessage = (event) => {
		console.log(event, channelRef.current)
		if (event.channelId === channelRef.current?.id) {
			messages.push(event);
			setMessages([...messages]);
		}
	};

	useEffect(() => {
		const setupMessaging = () => {
			messaging.on("message", receiveMessage);
		};
		setupMessaging();
	}, [messaging, props.channel]);

	useEffect(() => {
		messaging.off("message", receiveMessage);
		console.log("Update chnanle", props.channel);
		setCurrentChannel(props.channel);
		if (props.channel) {
			console.log("Subscribing to channel", props.channel)
			messaging.subscribe(`channels/${props.channel.id}/messages`);
		}
		setMessages([]);
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
