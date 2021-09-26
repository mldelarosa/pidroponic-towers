var SESSION_KEY = 'pidroponics.session';
var SESSION_KEY_STATE = 'state';
var SESSION_KEY_USERID = 'user-id';
var SESSION_KEY_REFRESH_TOKEN = 'auth.token.refresh';
var SESSION_KEY_ACCESS_TOKEN = 'auth.token.access';

var SESSION_KEY_PIDROPONIC_USERNAME = 'username';
var SESSION_KEY_PIDROPONIC_CLIENT = 'client';

var COLOR_GREEN = '#00FF00';
var COLOR_RED = '#FF0000';

// USAGE:
// TABLE[<event>][<current-state>] = <new-state>
const STATE_TRANSITION_TABLE = [
	// UNAUTHORIZED    //AUTHORIZING    //RUNNING
	[		0,				1,				2		], // PAGE_LOAD
	[		1,				-1,				-1		], // DID_SUBMIT_NEW_USER
	[		-1,				2,				-1		], // DID_ADD_NEW_USER
	[		-1,				0,				-1		], // DID_ADD_NEW_USER_FAIL
]

const STATE = {
	UNAUTHORIZED: 0,
	AUTHORIZING: 1,
	RUNNING: 2
}

const EVENT = {
	PAGE_LOAD: 0,
	DID_SUBMIT_NEW_USER: 1,
	DID_ADD_NEW_USER: 2,
	DID_ADD_NEW_USER_FAIL: 3
}

class Pidroponics {
	constructor(elem) {
		let data = this.getSessionStorage();
		if(!data) {
			data = {};
		}
		this.dom = elem;
		this.accessTokenInterval = {};

		// No state present for app. Start as an unauthorized client.
		if(!this.getState()) {
			this.setState(STATE.UNAUTHORIZED);
		}
	};

	render() {
		let sessionData = this.getSessionStorage();
		console.log('render-' + this.getState())
		let renderTemplate = document.getElementById('render-' + this.getState());
		if(renderTemplate) {
			let template = document.getElementById('render-' + this.getState()).innerHTML;
			let rendered = Mustache.render(template, sessionData);
			console.log('Rendering template with sessionData:');
			console.log(sessionData); 
			this.dom.innerHTML = rendered;
		} else {
			alert('Something went terribly bad; refreshing the session...');
			// TODO: de-auth and clear session state.
		}
		registerDomListeners();
	};

	onEvent(event, data) {
		console.log('On event [' + event + ']');
		this.setState(STATE_TRANSITION_TABLE[event][this.getState()]);

		// Event listeners:
		switch(event) {
			case EVENT.PAGE_LOAD:
				//do nothing
				break;
			case EVENT.DID_SUBMIT_NEW_USER:
				this.setPidroponicUsername(data.username);
				this.setPidroponicClient(data.client);
				break;
			case EVENT.DID_ADD_NEW_USER:
				console.log('Did receive new user:');
				console.log(data);
				this.setPidroponicUserId(data.user_id);
				this.setPidroponicUsername(data.username);
				this.setPidroponicClient(data.client);
				setRefreshToken(data.refresh_token);
				break;
			case EVENT.DID_ADD_NEW_USER_FAIL:
				sessionStorage.removeItem(SESSION_KEY_PIDROPONIC_USERNAME);
				sessionStorage.removeItem(SESSION_KEY);
				break;
			default:
				console.log('Unknown event received: ' + event);
				break;
		}

		// State listeners:
		let nState = parseInt(this.getState());
		console.log('Transitioning to state [' + nState + ']');
		switch(nState) {
			case STATE.AUTHORIZING:
				var app_authorizationInterval = window.setInterval(function(){
					console.log('Requesting new user authorization...');
					promiseToGetNewAuthorizedUser(app.getPidroponicUsername(), app.getPidroponicClient())
						.then(userAuthorization => {
							window.clearInterval(app_authorizationInterval);
							app.onEvent(EVENT.DID_ADD_NEW_USER, userAuthorization);
						})
						.catch(jqXHR => {
							// intentionally empty: User may still be in the process of pressing the button.
						})
				}, 2000);
				break;
			case STATE.RUNNING:
				var app_authorizationRefreshInterval = promiseToRefreshAccessToken();
				var app_statusInterval = window.setInterval(function(){
					console.log('Requesting current status...');
					promiseToGetStatus(getAccessToken())
						.then(statusData => {
							console.log(statusData);
						})
						.catch(xhr => {
							console.log('Failed to load status.');
							console.log(xhr);
						})
				}, 5000);
				break
		}

		// Rendering
		this.render();
	};

	/** SETTERS AND GETTERS **/
	setSessionStorage(state) {
		let strState = JSON.stringify(state);
		sessionStorage.setItem(SESSION_KEY, strState);
	};
	getSessionStorage() {
		let strState = sessionStorage.getItem(SESSION_KEY);
		if(strState) {
			return JSON.parse(strState);
		} else {
			return undefined;
		}
	};

	setState(newState) {
		let ss = this.getSessionStorage();
		if(!ss) { ss = {}; }
		ss[SESSION_KEY_STATE] = newState;
		this.setSessionStorage(ss);
		return ss[SESSION_KEY_STATE];
	};
	getState() {
		let ss = this.getSessionStorage();
		if(ss) {
			return ss[SESSION_KEY_STATE];
		} else {
			return undefined;
		}
	};

	setPidroponicUsername(newPidroponicUsername) {
		let ss = this.getSessionStorage();
		if(!ss) { ss = {}; }
		ss[SESSION_KEY_PIDROPONIC_USERNAME] = newPidroponicUsername;
		this.setSessionStorage(ss);
		return ss[SESSION_KEY_PIDROPONIC_USERNAME];
	};
	getPidroponicUsername() {
		let ss = this.getSessionStorage();
		if(ss) {
			return ss[SESSION_KEY_PIDROPONIC_USERNAME];
		} else {
			return undefined;
		}
	};

	setPidroponicClient(newPidroponicClient) {
		let ss = this.getSessionStorage();
		if(!ss) { ss = {}; }
		ss[SESSION_KEY_PIDROPONIC_CLIENT] = newPidroponicClient;
		this.setSessionStorage(ss);
		return ss[SESSION_KEY_PIDROPONIC_CLIENT];
	};
	getPidroponicClient() {
		let ss = this.getSessionStorage();
		if(ss) {
			return ss[SESSION_KEY_PIDROPONIC_CLIENT];
		} else {
			return undefined;
		}
	};

	setPidroponicUserId(newPidroponicUserId) {
		let ss = this.getSessionStorage();
		if(!ss) { ss = {}; }
		ss[SESSION_KEY_USERID] = newPidroponicUserId;
		this.setSessionStorage(ss);
		return ss[SESSION_KEY_USERID];
	};
	getPidroponicUserId() {
		let ss = this.getSessionStorage();
		if(ss) {
			return ss[SESSION_KEY_USERID];
		} else {
			return undefined;
		}
	};
}
