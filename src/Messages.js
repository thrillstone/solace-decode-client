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
	const [summaryVisibile, setSummaryVisibile] = useState(false);
	const channelRef = useRef();
	const messagesRef = useRef();
	channelRef.current = props.channel;
	messagesRef.current = messages;

	const receiveMessage = (event) => {
		console.log(event, channelRef.current)
		if (event.channelId === channelRef.current?.id) {
			messagesRef.current.push(event);
			setMessages([...messagesRef.current]);
		}
	};

	useEffect(() => {
		const setupMessaging = () => {
			messaging.on("message", receiveMessage);
		};
		setupMessaging();
	}, [messaging]);

	useEffect(() => {
		if (props.channel) {
			fetch(`http://localhost:8085/channels/${props.channel.id}/messages`, {
				headers: {
					'Content-Type': 'application/json',
				}
				})
			.then((response) => response.json())
			.then((c) => {
				setMessages(c)
			})
			.catch((error) => {
				console.error(error);
			});
		}
		
		console.log("Update chnanle", props.channel);
		setCurrentChannel(props.channel);
		if (props.channel) {
			console.log("Subscribing to channel", props.channel)
			messaging.subscribe(`channels/${props.channel.id}/messages`);
		}
		setMessages([]);
	}, [props.channel]);

	const toggleSummaryVisible = () => {
		setSummaryVisibile(!summaryVisibile);
	}

	const publishMessage = () => {
		if (props.channel) {
			console.log("Publishing to channel", props.channel)
			messaging.publish(`channels/${props.channel.id}/messages`, {type: "message", channelId: props.channel.id, id: uuidv4(), userId: 0, name: "Faraz", text: text, timestamp: "1:46 PM"});
		}
	}

	return (
		<div className="Messages">
			<div className="channel_summary">
				<div className="summary_header" onClick={toggleSummaryVisible}>
					<div className="summary_title">{channelRef.current?.name}</div>
					{summaryVisibile &&
						<div className="read_status">
							<div><b>80</b> Unread messages</div>
							<div><b>0</b> Mentions</div>
						</div>
					}
				</div>
				{summaryVisibile &&
					<div className="summary_content">
						<div className="summary_detail">
							<div className="summary_subtitle">Main Topics</div>
							<div className="topic">
								<div className="topic_name">"cats"</div>
								<div className="topic_confidence"><b>90%</b> confidence</div>
							</div>
						</div>
						<div className="summary_section">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
						</div>
					</div>
				}
			</div>
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
