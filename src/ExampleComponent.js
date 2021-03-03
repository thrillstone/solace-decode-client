import { EventContext } from "./solace/Messaging";
import { useEffect, useContext, useState } from 'react';

function ExampleComponent() {
	const messaging = useContext(EventContext);

	const [exampleReceived, setExampleReceived] = useState(false);

	useEffect(() => {
		const setupMessaging = () => {
			messaging.on("example", (event) => {
				console.log("Got an example", event);
				setExampleReceived(true);
			});
			messaging.subscribe("example");
		};
		setupMessaging();
	}, [messaging]);

	const publishMessage = () => {
		messaging.publish("example", {
			type: "example"
		});
	}

	const publisToServer = () => {
		messaging.publish("message", {
			id: Date.now(),
			payload: "This came from the React app!"
		});
	}
	
	return (
		<div className="ExampleComponent">
			<span>{exampleReceived ? "Got it" : "Waiting for message"}</span>
			<button onClick={publishMessage}>Publish</button>
			<div>
				<button onClick={publisToServer}>Send to Mongo</button>
			</div>
		</div>
	);
}

export default ExampleComponent;
