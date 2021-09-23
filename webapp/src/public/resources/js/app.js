var SESSION_KEY = 'pidroponics.session';
var SESSION_KEY_STATE = 'state';
var SESSION_KEY_USERID = 'user.id';
var SESSION_KEY_REFRESH_TOKEN = 'auth.token.refresh';
var SESSION_KEY_ACCESS_TOKEN = 'auth.token.access';

var SESSION_KEY_PIDROPONIC_USERNAME = 'pidroponics.username';
var SESSION_KEY_PIDROPONIC_CLIENT = 'pidroponics.client';

var COLOR_GREEN = '#00FF00';
var COLOR_RED = '#FF0000';

// USAGE:
// TABLE[<event>][<current-state>] = <new-state>
let STATE_TRANSITION_TABLE = [
	// UNAUTHORIZED    //AUTHORIZING    //RUNNING
	[		0,				1,				2		], // PAGE_LOAD
	[		1,				-1,				-1		], // DID_SUBMIT_NEW_USER
	[		-1,				2,				-1		], // DID_ADD_NEW_USER
	[		-1,				0,				-1		], // DID_ADD_NEW_USER_FAIL
]

let STATE = {
	UNAUTHORIZED: 0,
	AUTHORIZING: 1,
	RUNNING: 2
}

let EVENT = {
	PAGE_LOAD: 0,
	DID_SUBMIT_NEW_USER: 1,
	DID_ADD_NEW_USER: 2,
	DID_ADD_NEW_USER_FAIL: 3
}

class Pidroponics {
	constructor(elem) {
		let data = {};
		this.dom = elem;

		// No state present for app. Start as an unauthorized client.
		if(!this.getState()) {
			this.setState(STATE.UNAUTHORIZED);
		}

		// Parse the current state and initialize view based on existing state.
		let nState = parseInt(this.getState());
		switch(nState) {
			case STATE.RUNNING:
				data.username = this.getPidroponicUsername();
				break
		}
		this.render(data);
	};

	render(data) {
		console.log('render-' + this.getState())
		let renderTemplate = document.getElementById('render-' + this.getState());
		if(renderTemplate) {
			let template = document.getElementById('render-' + this.getState()).innerHTML;
			let rendered = Mustache.render(template, data);
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
				this.setRefreshToken(data.refresh_token);
				promiseToRequestAccessToken(app.getRefreshToken())
					.then(accessToken => {
							this.setAccessToken(accessToken);
						})
						.catch(xhr => {
							console.log('Failed to request access token with new refressh token');
							console.log(xhr);
						})
				break;
			case EVENT.DID_ADD_NEW_USER_FAIL:
				sessionStorage.removeItem(SESSION_KEY_PIDROPONIC_USERNAME);
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
				var self = window.setInterval(function(){
					console.log('Requesting new user authorization...');
					promiseToGetNewAuthorizedUser(app.getPidroponicUsername(), app.getPidroponicClient())
						.then(userAuthorization => {
							window.clearInterval(self);
							app.onEvent(EVENT.DID_ADD_NEW_USER, userAuthorization);
						})
						.catch(jqXHR => {
							// intentionally empty: User may still be in the process of pressing the button.
						})
				}, 2000);
				break;
			case STATE.RUNNING:
				var self = window.setInterval(function(){
					console.log('Requesting current status...');
					promiseToGetStatus(app.getAccessToken())
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
		this.render(data);
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

	setRefreshToken(newRefreshToken) {
		let ss = this.getSessionStorage();
		if(!ss) { ss = {}; }
		ss[SESSION_KEY_REFRESH_TOKEN] = newRefreshToken;
		this.setSessionStorage(ss);
		return ss[SESSION_KEY_REFRESH_TOKEN];
	};
	getRefreshToken() {
		let ss = this.getSessionStorage();
		if(ss) {
			return ss[SESSION_KEY_REFRESH_TOKEN];
		} else {
			return undefined;
		}
	};

	setAccessToken(newAccessToken) {
		sessionStorage.setItem(SESSION_KEY_ACCESS_TOKEN, newAccessToken);
	};
	getAccessToken() {
		let strState = sessionStorage.getItem(SESSION_KEY_ACCESS_TOKEN);
		if(strState) {
			return strState;
		} else {
			return undefined;
		}
	};
}
