import properties from "./properties.js";
import React from "react";

class Messaging {

	constructor() {
		this.listeners = {};
		this.correlationKeys = {};
		this.solace = window.solace;
	}

	/**
	 * Connect to the event broker.
	 * 
	 * @returns {Promise} A promise with the session to the event broker. Rejects with an object with a reason.
	 */
	connect() {
		return new Promise((resolve, reject) => {
			var factoryProps = new this.solace.SolclientFactoryProperties();
			factoryProps.profile = this.solace.SolclientFactoryProfiles.version10;
			this.solace.SolclientFactory.init(factoryProps);
			// this.solace.SolclientFactory.setLogLevel(this.solace.LogLevel.DEBUG);
			this.session = this.solace.SolclientFactory.createSession(properties);
			this.session.on(this.solace.SessionEventCode.UP_NOTICE, () => {
				resolve(this.session);
			});
			this.session.on(this.solace.SessionEventCode.CONNECT_FAILED_ERROR, (error) => {
				reject(error);
			});
			this.session.on(this.solace.SessionEventCode.SUBSCRIPTION_OK, (event) => {
				this.correlationKeys[event.correlationKey].resolve(event);
				delete(this.correlationKeys[event.correlationKey]);
			});
			this.session.on(this.solace.SessionEventCode.SUBSCRIPTION_ERROR, (event) => {
				this.correlationKeys[event.correlationKey].reject(event);
				delete(this.correlationKeys[event.correlationKey]);
			});

			this.session.on(this.solace.SessionEventCode.MESSAGE, (event) => {
				const content = JSON.parse(event.getBinaryAttachment());
				const eventType = content.type;
				const listeners = this.listeners[eventType];
				if (listeners) {
					listeners.forEach(listener => listener(content));
				}
			});
			try {
				this.session.connect();
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Publishes the content to the topic on the event broker.
	 * 
	 * @param {string} topic
	 * @param {Object} content
	 */
	publish(topic, content) {
		if (!this.session) {
			throw new Error({
				reason: "Session is not established with the event broker"
			});
		}
		const payload = JSON.stringify(content);
		const event = this.solace.SolclientFactory.createMessage();
		event.setDestination(this.solace.SolclientFactory.createTopicDestination(topic));
		event.setBinaryAttachment(payload);
		event.setDeliveryMode(this.solace.MessageDeliveryModeType.DIRECT);
		this.session.send(event);
	}

	/**
	 * Register a listener for a particular eventName to be called when an event is received
	 * from the event broker of the given eventName. Note that you must subscribe for the appropriate
	 * topic to be able to receive events but you should setup this listener first else you may
	 * receive events before they're ready to be handled.
	 * 
	 * @param {string} eventName The name of the event in the message payload
	 * @param {function} listener The listener to add
	 */
	on(eventName, listener) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(listener);
	}

	/**
	 * De-register a listener for a particular eventName so it is no longer called when an event
	 * is received.
	 * 
	 * @param {string} eventName The name of the event in the message payload
	 * @param {function} listener The listener to remove
	 */
	off(eventName, listener) {
		const listeners = this.listeners[eventName];
		if (!listeners) {
			return;
		}
		const index = listeners.indexOf(listener);
		if (index > -1) {
			listeners.splice(index, 1);
		}
	}

	/**
	 * Subscribe to a topic on the event broker to begin having events forwarded to listeners of given
	 * event types registered via the on method.
	 * 
	 * @param {string} topic The topic to subscribe to on the event broker
	 * 
	 * @returns {Promise} A promise with the subscription event. Rejects with an object with a reason.
	 */
	subscribe(topic) {
		if (!this.session) {
			return Promise.reject({
				reason: "Session has not yet connected to the event broker"
			});
		}
		return new Promise((resolve, reject) => {
			const key = `subscribe ${Math.random()} ${topic}`; // TODO use a UUID or something better
			this.correlationKeys[key] = {
				resolve: resolve,
				reject: reject
			};
			this.session.subscribe(
				this.solace.SolclientFactory.createTopic(topic),
				true, // generate confirmation when subscription is added successfully
				key, // use topic name as correlation key
				10000 // 10 seconds timeout for this operation
			);
		});
	}

	disconnect() {
		this.session.exit();
	}
}

export const messaging = new Messaging();
export const EventContext = React.createContext(messaging);