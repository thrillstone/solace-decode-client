import './App.css';
import { EventContext } from "./solace/Messaging";
import ExampleComponent from "./ExampleComponent";
import Messages from "./Messages";
import ChannelsList from "./ChannelsList";
import { useEffect, useContext, useState } from 'react';

function App() {
	const messaging = useContext(EventContext);

	const [connected, setConnected] = useState(false);
	const [channels, setChannels] = useState([]);
	const [selectedChannel, setSelectedChannel] = useState(null);

	useEffect(() => {

		const fetchChannels = () => {
			fetch('http://localhost:8080/channels')
			.then((response) => {
				setChannels(response);
			})
			.catch((error) => {
				console.error(error);
				setChannels([{name:'deCODE', id: 0}, {name:'Solace', id: 1}]);
			});
		};
		fetchChannels();
	}, []);

	const channelChanged = (channel) => {
		console.log(channel);
		setSelectedChannel(channel);
	}

	return (
		<div className="App">
			<ChannelsList channels={channels} onChangeChannel={channelChanged} />
			<Messages channel={selectedChannel} />
		</div>
	);
}

export default App;
