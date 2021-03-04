import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState } from 'react';

function Messages() {
	const messaging = useContext(EventContext);
    const [exampleReceived, setExampleReceived] = useState(false);

    const [messages, setMessages] = useState([]);
    const [channel, setChannel] = useState(null);

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
	}, [messages, channel]);
	
	return (
		<div className="Messages">
			Messages go here!
            {messages} {channel?.name}
		</div>
	);
}

export default Messages;
