import React from 'react';
import './Messages.css';
import './Search.css';
import {default as search} from './icons/search-24px.svg';

const SearchScope = Object.freeze({current: 0, all: 1});

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {inputText: '', searchScope: SearchScope.current, showSearchResults: false, searchResults: []};
    }

    enterText = (event) => {
        this.setState({showSearchResults: false, inputText: event.target.value});
    }

    getSearchResults = (query) => {
        // let messages = [{
        //     id: 0,
        //     text: 'a message to @bob',
        //     name: 'Alice',
        //     timestamp: '5:23',
        //     channel: {id: 0, name: 'deCODE'}
        // }, {
        //     id: 1,
        //     text: 'another message',
        //     name: 'Bob',
        //     timestamp: '6:27',
        //     channel: {id: 1, name: 'Solace'}
        // }];

        // if (this.state.searchScope === SearchScope.current) {
        //     messages = messages.filter(message => message.channel.id === this.props.channel.id);
        // }

        // this.setState({
        //     showSearchResults: true,
        //     searchResults: messages
        // });

        // return;

		fetch('http://localhost:8085/search/messages', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(query)
        
		}).then(res => res.json())
        .then(messages => {
            if (this.state.searchScope === SearchScope.current) {
                messages = messages.filter(message => message.channelId === this.props.channel.id);
            }

            fetch('http://localhost:8085/channels', {
				headers: {
					'Content-Type': 'application/json',
				}
			}).then(res => res.json())
            .then(channels => {
                let channelMap = {};

                for (let channel in channels) {
                    channelMap[channel.id] = channel;
                }

                this.setState({
                    showSearchResults: true,
                    searchResults: messages.map(message => new Object({
                        id: message.id,
                        text: message.payload,
                        author: 'Bob',
                        timestamp: '5:23',
                        channel: channelMap[message.channelId]
                    }))
                });
            }).catch(console.error);
        }).catch(console.error);
    }

    search = () => {
        if (this.state.inputText.length === 0) {
            return;
        }

        this.setState({showSearchResults: false});
        this.getSearchResults({content: this.state.inputText, userId: this.props.user.id});
    }

    goToChannel = (channel) => {
        this.setState({showSearchResults: false});
        this.props.onChangeChannel(channel);
    }

    getPlaceholderText = () => {
        return `Search ${this.state.searchScope === SearchScope.current ? 'current channel' : 'all channels'}...`;
    }

    changeSearchScope = (searchScope) => {
        this.setState({searchScope});

        if (this.state.showSearchResults) {
            this.setState({showSearchResults: false});
        }
    }

    getHighlights = (text, search) => {
        const splits = text.toLowerCase().split(search.toLowerCase());

        if (splits.length === 1) {
            return text;
        }

        let highlightedText = "";
        let i = 0;

        for (let j = 0; j < splits.length; ++j) {
            if (j === splits.length - 1) {
                highlightedText += text.substring(i);
            } else {
                highlightedText += text.substring(i, i + splits[j].length)

                i += splits[j].length;

                highlightedText += `<span class="highlight">${text.substring(i, i + search.length)}</span>`;

                i += search.length;
            }
        }

        return highlightedText;
    }

    getMessageHighlights = (messageText) => {
        return this.getHighlights(this.getHighlights(messageText, this.state.inputText), `@${this.props.user.name}`);
    }

    render = () => {
        return <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
            <div style={{width: '100%', height: '2.5em', backgroundColor: 'white', display: 'flex', borderRadius: '4px'}}>
                <div style={{width: '80%', display: 'flex', alignItems: 'center'}}>
                    <button style={{marginLeft: '8px', border: 'none', background: 'none'}} onClick={this.search}><img src={search}/></button>
                    <input style={{width: '90%', border: 0, marginLeft: '8px'}} onChange={this.enterText} placeholder={this.getPlaceholderText()}/>
                </div>
                <button style={{width: '8em', backgroundColor: 'lightgray', border: 0}} onClick={() => this.changeSearchScope(SearchScope.current)}>
                    <span style={{fontWeight: this.state.searchScope === SearchScope.current ? 'bold' : 'normal'}}>Current</span>
                </button>
                <button style={{width: '8em', backgroundColor: '#d4daf5', border: 0}} onClick={() => this.changeSearchScope(SearchScope.all)}>
                    <span style={{fontWeight: this.state.searchScope === SearchScope.all ? 'bold' : 'normal'}}>All</span>
                </button>
            </div>
            <div style={{width: '100%', border: '1px solid gray', borderRadius: '4px', position: 'fixed', top: '3em', background: 'white', flexDirection: 'column', display: this.state.showSearchResults ? 'flex' : 'none', textAlign: 'center'}}>
                {
                    this.state.searchResults.map(message => <div key={message.id} style={{display: 'flex', height: '60px'}}>
                        <div className="message" style={{width: '100%'}}>
                            <img className="messageImage" src="https://st.depositphotos.com/1779253/5140/v/600/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg"></img>
                            <div style={{textAlign: 'left'}}>
                                <div>
                                    <span>
                                        <span><strong>{message.name}</strong></span>
                                        <span className="messageTime">{' in '}<a onClick={() => this.goToChannel(message.channel)}>{message.channel.name}</a></span>
                                    </span>
                                    <span style={{marginLeft: '10px'}} className="messageTime">{message.timestamp}</span>
                                </div>
                                <div className="messageText">
                                    "<span dangerouslySetInnerHTML={{__html: this.getMessageHighlights(message.text)}}/>"
                                </div>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>;
    }
}

export default Search