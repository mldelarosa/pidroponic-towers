'use strict';
let Humidity = require('../../../model/device/sensor/humidity');

module.exports = class HumidityDao {
	constructor() {}

	getHumiditySensor() {
		console.log('SERIAL_OUT: [Read Humidity]');
		console.log('SERIAL_IN: [0]');
		return new Humidity(0);
	}
}
