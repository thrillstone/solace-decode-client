import './App.css';
import { EventContext } from "./solace/Messaging";
import ExampleComponent from "./ExampleComponent";
import { useEffect, useContext, useState } from 'react';

function App() {
	const messaging = useContext(EventContext);

	const [connected, setConnected] = useState(false);

	useEffect(() => {
		const setupMessaging = () => {
			console.log("effect run again");
			messaging.on("hello", (event) => {
				console.log("Got a hello", event);
			});
			messaging.connect().then(() => {
				setConnected(true);
				messaging.subscribe("hello");
			});
		};
		setupMessaging();
	}, [messaging]);
	
	return (
		<div className="App">
			{!connected
				? <div>Connecting</div>
				: <ExampleComponent/>
			}
		</div>
	);
}

export default App;
