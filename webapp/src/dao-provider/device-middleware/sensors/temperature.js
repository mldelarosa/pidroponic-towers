'use strict';
let Temperature = require('../../../model/device/sensor/temperature');

module.exports = class TemperatureDao {
	constructor() {}

	getTemperatureSensor() {
		console.log('SERIAL_OUT: [Read Temperature]');
		console.log('SERIAL_IN: [0]');
		return new Temperature('C', 0);
	}
}
