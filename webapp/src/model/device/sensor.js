'use strict';
let Device = require('../device');

module.exports = class Sensor extends Device {
	constructor(name, unit, value) {
		super(name);
		this.unit = unit;
		this.value = value;
	}

	getUnit() {
		return this.unit;
	}

	setUnit(newUnit) {
		this.unit = newUnit;
	}

	getValue() {
		return this.value;
	}

	setValue(newValue) {
		this.value = newValue;
	}

	getSensorReadout() {
		let sensorReadout = '';
		return sensorReadout.concat(this.value).concat(' ').concat(this.unit);
	}
}
