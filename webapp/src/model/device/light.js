'use strict';
let Device = require('../device');

module.exports = class Light extends Device {
	static stateKeys = ['on'];

	constructor(name, state) {
		super(name);
		this.state = state;
	}

	getState() {
		return this.state;
	}

	setState(newState) {
		if(newState){
			console.log('Setting new state');
			console.log(newState);
			Light.stateKeys.forEach(stateKey => {
				if(newState.hasOwnProperty(stateKey)) {
					// purposefully empty... new state passes check
				} else {
					console.warn('Missing key in new state: ' + stateKey);
					throw('Missing required key in state: ' + stateKey);
				}
			});
			this.state = newState;
		}
	}

	toggleOn() {
		let currentState = this.getState();
		if(currentState.on){
			currentState.on = 0;
		} else {
			currentState.on = 1;
		}
		this.setState(currentState);
	}
}
