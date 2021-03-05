import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState } from 'react';
import Message from './Message'

function Messages(props) {
	const messaging = useContext(EventContext);
    const [exampleReceived, setExampleReceived] = useState(false);
    const [messages, setMessages] = useState([{type: "message", id: 0, userId: 0, name: "Faraz", text: "Hello, world!", timestamp: "1:46 PM"}, {type: "message", id: 1, userId: 1, name: "World", text: "Hi, Faraz!", timestamp: "1:47 PM"}]);
	const [text, setText] = useState("")

	useEffect(() => {
		// const fetchMessages = () => {
		// 	fetch(`http://localhost:8080/channels/${channel.id}/messages`)
		// 	.then((response) => {
		// 		setMessages(response);
		// 	})
		// 	.catch((error) => {
		// 		console.error(error);
		// 	});
		// };
		// fetchMessages();
	}, [messages, props.channel]);
	
	function sendMessage() {
		console.log(text)
	}
	
	return (
		<div className="Messages">
            <div className="chat_header">
				<h1>Header</h1>
            </div>
            <div className="chat_body">
				{
					messages.map((message) =>
						<Message message={message} />
					)
				}
            </div>
			<div className="chat_footer">
				<input value={text} onChange={(e) => setText(e.target.value)} placeholder="type something" />
				<button type="submit" disabled={!text} onClick={sendMessage}>↩️</button>
            </div>
		</div>
	);
}

export default Messages;
