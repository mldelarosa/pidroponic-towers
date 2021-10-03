'use strict'

/* Declare Data Model*/
const requireBasePath = '../../dao-provider/device-middleware/devices/';
const Devices = {
	LIGHT: 'light'
};
var DeviceDaoFactory = {};
Object.keys(Devices).map(key => {
	let device = Devices[key];
	const sensorDao = require(requireBasePath + device);
	DeviceDaoFactory[device] = new sensorDao();
});

var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const jwtFilter = require('../../controller/filter/bearer-token-jwt');

const JWT_SIGNING_SECRET = 'changeme';
const PUBLIC_PATHS = []; // Intentionally empty: all paths require authentication.

// Authentication middleware
router.use(function timeLog (req, res, next) {
	if(PUBLIC_PATHS.indexOf(req.path) > -1) {
		// path is exempt from authentication layer
		next();
	} else {
		jwtFilter.jwtBearerTokenAuth(req, res, next);
	}
});

router.get('/light', function (req, res) {
	let light = DeviceDaoFactory[Devices.LIGHT].getLight();
	return res.status(200).json(JSON.stringify(light));
});

router.post('/light', function (req, res) {
	let light = DeviceDaoFactory[Devices.LIGHT].getLight();
	switch(req.body.cmd) {
		case 'toggle':
			console.log('On light toggle...');
			light.toggleOn();
			break;
		default:
			let requestedState = req.body.state
			if(requestedState) {
				light.setState(requestedState);
			}
			break;
	}
	let updatedLight = DeviceDaoFactory[Devices.LIGHT].updateLight(light);
	let response = JSON.stringify(updatedLight);
	return res.status(200).json(response);
});

module.exports = router;
