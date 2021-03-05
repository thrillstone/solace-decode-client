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
		const setupMessaging = () => {
			messaging.connect()
			.then(() => {
				setConnected(true);
			})
			.catch(console.error);
			messaging.on("channel", (event) => {
				channels.push(event);
				setChannels(channels);
			});
			messaging.subscribe(`channels/*/messages`);
		};
		setupMessaging();
	}, [messaging]);

	const publishMessage = (message) => {
		if (connected){
			messaging.publish(`channels/${selectedChannel.id}/messages`, message);
		}
	}

	useEffect(() => {

		const fetchChannels = () => {
			fetch('http://localhost:8085/channels')
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
			<div class="container">
				<ChannelsList channels={channels} onChangeChannel={channelChanged} />
				<Messages channel={selectedChannel} />
			</div>
		</div>
	);
}

export default App;
