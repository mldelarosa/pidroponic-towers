'use strict';
let Sensor = require('../sensor');

const _TEMPERATURE_BASE_UNIT_F = 'F';
const _TEMPERATURE_BASE_UNIT_C = 'C';

module.exports = class Temperature extends Sensor {
	// base-unit :: The unit of measurement used by the sensor.
	constructor(baseUnit, value) {
		super('Temperature', undefined, value);
		this.baseUnit = baseUnit;
		if(baseUnit == _TEMPERATURE_BASE_UNIT_F) {
			super.setUnit('°F');
		} else if (baseUnit == _TEMPERATURE_BASE_UNIT_C) { 
			super.setUnit('°C');
		} else {
			console.error('Unrecognized base-unit [' + baseUnit + '] initialize with C or F');
			throw ('Unrecognized base-unit [' + baseUnit + ']');
		}
	}

	getFahrenheit() {
		if(this.baseUnit == _TEMPERATURE_BASE_UNIT_C) {
			return celsiusToFahrenheit(this.value);
		} else {
			return this.value;
		}
	}

	getCelsius() {
		if(this.baseUnit == _TEMPERATURE_BASE_UNIT_F) {
			return fahrenheitToCelsius(this.value);
		} else {
			return this.value;
		}
	}

	celsiusToFahrenheit(c) {
		let f =  (c *1.8) + 32;
	}

	fahrenheitToCelsius(f) {
		let c = (f - 32) * .5556;
	}
}
