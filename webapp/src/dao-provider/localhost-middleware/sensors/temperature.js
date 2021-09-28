'use strict';

let Temperature = require('../../../model/device/sensor/temperature');

module.exports = class TemperatureDao {
	constructor() {}

	getTemperatureSensor() {
		return new Temperature('C', 0);
	}
}
