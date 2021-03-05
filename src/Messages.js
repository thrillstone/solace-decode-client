import "./Messages.css";
import { EventContext } from "./solace/Messaging";
import { UserContext } from "./auth/User";
import { useEffect, useContext, useState, useRef } from 'react';
import Message from './Message'
import './App.css'
import {default as send} from './icons/send-24px.svg';

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
  }

function Messages(props) {
	const messaging = useContext(EventContext);
	
	const user = useContext(UserContext);
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
				setMessages([]);
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
			debugger
			console.log("Publishing to channel", props.channel, user)
			const date = new Date().getTime();
			messaging.publish(`channels/${props.channel.id}/messages`, {type: "message", channelId: props.channel.id, id: user[0].id, userId: user[0].id, name: user[0].userName, avatar: user[0].image, text: text, timestamp: `${date}`});
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
							{props.channel.description}
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
					<button class="sendButton" type="submit" disabled={!text} onClick={publishMessage}>
						<img src={send}/>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Messages;
