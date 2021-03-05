import './App.css';
import { EventContext } from "./solace/Messaging";
import Messages from "./Messages";
import ChannelsList from "./ChannelsList";
import Search from "./Search";
import Branding from "./Branding";
import { useEffect, useContext, useState } from 'react';

function App() {
	const messaging = useContext(EventContext);
	const [connected, setConnected] = useState(false);

	const [channels, setChannels] = useState([]);
	const [selectedChannel, setSelectedChannel] = useState(null);
	const [addChannelVisible, setAddChannelVisible] = useState(false);
	const [newChannelName, setNewChannelName] = useState("");
	const [newChannelType, setNewChannelType] = useState("social");

	useEffect(() => {
		const setupMessaging = () => {
			messaging.connect()
			.then(() => {
				setConnected(true);
			})
			.catch(console.error);
			messaging.on("channel", (event) => {
				channels.push(event);
				setChannels([...channels]);
			});
		};
		setupMessaging();
	}, [messaging]);

	useEffect(() => {
		if (connected) {
			messaging.subscribe("channels");
		}
	}, [connected])

	const publishMessage = (message) => {
		if (connected){
			messaging.publish(`channels/${selectedChannel.id}/messages`, message);
		}
	}

	useEffect(() => {

		const fetchChannels = () => {
			fetch('http://localhost:8085/channels', {
				headers: {
					'Content-Type': 'application/json',
				}
			  })
			.then((response) => response.json())
			.then((c) => {
				setChannels(c);
				if (c.length > 0) {
					setSelectedChannel(c[0]);
				}
			})
			.catch((error) => {
				console.error(error);
				var x = [{name:'deCODE', id: 0, channelType: "Work"}, {name:'Solace', id: 1, channelType: "Work"}]
				setChannels(x);
				if (x.length > 0) {
					setSelectedChannel(x[0]);
				}
			});
		};
		fetchChannels();
	}, []);

	const channelChanged = (channel) => {
		console.log(channel);
		setSelectedChannel(channel);
		setChannels(channels);
	}

	const saveChannel = () => {
		const date = new Date();
		fetch('http://localhost:8085/channels', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: newChannelName,
				channelType: newChannelType,
				time: date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
			})
		}).catch(console.error)
		.finally(() => setAddChannelVisible(false));
	}

	const toggleAddChannelVisible = () => {
		setAddChannelVisible(!addChannelVisible);
	}

	const changeName = (event) => {
		setNewChannelName(event.target.value)
	}

	const changeChannelType = (event) => {
		setNewChannelType(event.target.value);
	}

	if (!connected) {
		return <h1>Loading</h1>;
	}

	return (
		<div className="App">
			<div className="header" style={{display: 'flex'}}>
				<Branding/>
				<Search channel={{id: 0, name: 'deCODE'}} onChangeChannel={channelChanged} user={{id: 0, name: 'Bob'}}/>
			</div>
			<div className="container">
				<ChannelsList channels={channels} onChangeChannel={channelChanged} selectedChannel={selectedChannel} onNewChannel={toggleAddChannelVisible}/>
				<Messages channel={selectedChannel} />
				{addChannelVisible &&
					<div className="dialog-container">
						<div className="dialog">
							<div className="dialog-contents">
								<h2>Add a channel</h2>
								<label>
									Name:
									<input type="text" value={newChannelName} onChange={changeName}/>
								</label>
								<label>
									Type:
									<select value={newChannelType} onChange={changeChannelType}>
										<option value="hobbies">Hobbies</option>
										<option value="social" selected>Social</option>
										<option value="work">Work</option>
									</select>
								</label>
								<button onClick={saveChannel}>Save</button>
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	);
}

export default App;
