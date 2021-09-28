'use strict';

module.exports = class Device {
	constructor(name) {
		this.name = name;
	}
	
	getName() {
		return this.name;
	}
}
