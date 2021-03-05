import './App.css';
import { EventContext } from "./solace/Messaging";
import Messages from "./Messages";
import ChannelsList from "./ChannelsList";
import Login from "./Login";
import Search from "./Search";
import Branding from "./Branding";
import { useEffect, useContext, useState, useRef } from 'react';
import { user, UserContext } from "./auth/User"

function App() {
	const messaging = useContext(EventContext);
	const [connected, setConnected] = useState(false);

	const [channels, setChannels] = useState([]);
	const [selectedChannel, setSelectedChannel] = useState(null);
	const [addChannelVisible, setAddChannelVisible] = useState(false);
	const [newChannelName, setNewChannelName] = useState("");
	const [newChannelType, setNewChannelType] = useState("social");
	const channelRef = useRef();
	channelRef.current = channels;
	const [newChannelDescription, setNewChannelDescription] = useState("");

	const [userState, setUser] = useState(user);

  useEffect(() => {
    userState.save();
  }, [userState])

	useEffect(() => {
		const setupMessaging = () => {
			messaging.connect()
			.then(() => {
				setConnected(true);
			})
			.catch(console.error);
			messaging.on("channel", (event) => {
				channelRef.current.push(event);
				setChannels([...channelRef.current]);
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
				time: date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
				description: newChannelDescription
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

	const changeChannelDescription = (event) => {
		setNewChannelDescription(event.target.value);
	}

	if (!connected) {
		return <h1>Loading</h1>;
	}

	return (
    <UserContext.Provider value={[userState, setUser]}>
      <div className="App">
        <div className="header" style={{display: 'flex'}}>
          <Branding/>
          <Search channel={selectedChannel} channels={channels} onChangeChannel={channelChanged} user={{id: 0, name: 'Bob'}}/>
        </div>
        <div className="container">
          <ChannelsList channels={channels} onChangeChannel={channelChanged} selectedChannel={selectedChannel} onNewChannel={toggleAddChannelVisible}/>
          <Messages channel={selectedChannel} />
          {!userState.userName && <Login />}
		  {addChannelVisible &&
			<div className="dialog-container">
				<div className="dialog">
					<div className="dialog-contents">
						<h2>Create Channel</h2>
						<p>Name</p>
						<input className="new_channel_name textarea" type="text" value={newChannelName} onChange={changeName}/>
						<p>Description</p>
						<textarea class="new_channel_description textarea" resize="none" onChange={changeChannelDescription}/>
						<p>Type</p>
						<a className="typeButton hobbyButton" value="hobbies" onClick={changeChannelType}>Hobbies</a>
						<a className="typeButton socialButton" value="social" onClick={changeChannelType}>Social</a>
						<a className="typeButton workButton" value="work" onClick={changeChannelType}>Work</a>
						<button className="createButton" onClick={saveChannel}>CREATE</button>
						<button className="cancelButton" onClick={toggleAddChannelVisible}>CANCEL</button>
					</div>
				</div>
			</div>
			}
        </div>
      </div>
    </UserContext.Provider>
	);
}

export default App;