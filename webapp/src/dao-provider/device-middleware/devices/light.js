'use strict';
let Light = require('../../../model/device/light');

module.exports = class LightDao {
	static cache = {};
	constructor() {};
	
	getLight() {
		if(LightDao.cache.state) {
			// Intentionally empty... state already exists so just return.
		} else {
			console.log('No cached state set for lights... defaulting to off');
			console.log('SERIAL_OUT: [Read Light state]');
			console.log('SERIAL_IN: [0]');
			let offState = { on: 0 };
			let newLight = new Light('Light', offState);
			LightDao.cache = newLight;
		}
		return LightDao.cache;
	}

	updateLight(light) {
		console.log('SERIAL_OUT: write desired state of light');
		console.log(light.getState());
		console.log('SERIAL_IN: read current state of light');
		return light;
	}
}
