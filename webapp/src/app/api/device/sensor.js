'use strict'

/* Declare Data Model*/
var TemperatureDao = require('../../../dao-provider/device-middleware/sensors/temperature');
var HumidityDao = require('../../../dao-provider/device-middleware/sensors/humidity');
var temperatureDao = new TemperatureDao();
var humidityDao = new HumidityDao();


var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const jwtFilter = require('../../../controller/filter/bearer-token-jwt');

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

router.get('/temperature', function (req, res) {
	let temperatureSensor = temperatureDao.getTemperatureSensor();
	let response = { readout: temperatureSensor.getSensorReadout() };
	return res.status(200).json(response);
});

router.get('/humidity', function (req, res) {
	let humiditySensor = humidityDao.getHumiditySensor();
	let response = { readout: humiditySensor.getSensorReadout() };
	return res.status(200).json(response);
});

module.exports = router;
