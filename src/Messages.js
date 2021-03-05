import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState } from 'react';

function Messages(props) {
    const messaging = useContext(EventContext);
    const [connected, setConnected] = useState(false);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
       
        const setupMessaging = () => {
            if (connected){
                messaging.connect()
                .then(() => {
                    setConnected(true);
                })
                .catch(console.error);
                messaging.on("message", (event) => {
                    messages.push(event);
                });
                messaging.subscribe(`channels/${props.channel.id}/messages`);
            }
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
	}, [messages]);
	
	return (
		<div className="Messages">
			Messages go here!
            {messages} {props.channel?.name}
		</div>
	);
}

export default Messages;
