import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState } from 'react';

function Messages() {
	const messaging = useContext(EventContext);
    const [exampleReceived, setExampleReceived] = useState(false);

    const [messages, setMessages] = useState([]);
    const [channelID, setChannel] = useState(0);

	useEffect(() => {
		// const fetchMessages = () => {
		// 	fetch(`http://localhost:8080/channels/${channelID}/messages`)
		// 	.then((response) => {
		// 		setMessages(response);
		// 	})
		// 	.catch((error) => {
		// 		console.error(error);
		// 	});
		// };
		// fetchMessages();
	}, [messages, channelID]);
	
	return (
		<div className="Messages">
			Messages go here!
            {messages}
		</div>
	);
}

export default Messages;
