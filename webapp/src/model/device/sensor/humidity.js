'use strict';
let Sensor = require('../sensor');

module.exports = class Humidity extends Sensor {
	constructor(value) {
		super('Humidity', '%', value);
	}
}
