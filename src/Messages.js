import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState } from 'react';

function Messages() {
    const messaging = useContext(EventContext);
    const [connected, setConnected] = useState(false);

    const [messages, setMessages] = useState([]);
    // const [channel, setChannel] = useState(null);

    useEffect(() => {
		const setupMessaging = () => {
			messaging.connect()
			.then(() => {
				setConnected(true);
			})
			.catch(console.error);
			messaging.on("message", (event) => {
				messages.push(event);
			});
			messaging.subscribe(`channels/${channel.id}/messages`);
		};
		setupMessaging();
	}, [messaging]);

	useEffect(() => {
		// const fetchMessages = () => {
		// 	fetch(`http://localhost:8085/channels/${channel.id}/messages`)
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
		<div className="Messages messages-list">
            <div>
                <h3>Messages go here!</h3>
                {messages} {channel?.name}
            </div>
		</div>
	);
}

export default Messages;
