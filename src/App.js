import './App.css';
import { EventContext } from "./solace/Messaging";
import ExampleComponent from "./ExampleComponent";
import Messages from "./Messages";
import Channels from "./Channels";
import { useEffect, useContext, useState } from 'react';

function App() {
	const messaging = useContext(EventContext);

	const [connected, setConnected] = useState(false);
	const [channels, setChannels] = useState([]);
	const selected = useState(0);

	useEffect(() => {

		const fetchChannels = () => {
			fetch('http://localhost:8080/channels')
			.then((response) => {
				setChannels(response);
			})
			.catch((error) => {
				console.error(error);
			});
		};

		fetchChannels();

	}, [channels]);
	
	return (
		<div className="App">
			<Channels channels={channels} />
			<Messages channelID={selected} />
		</div>
	);
}

export default App;
