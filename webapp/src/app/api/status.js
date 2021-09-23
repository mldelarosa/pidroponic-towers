'use strict'
var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const jwtFilter = require('../../controllers/filters/bearer-token-jwt');

const JWT_SIGNING_SECRET = 'changeme';
const PUBLIC_PATHS = [];

// Authentication middleware
router.use(function timeLog (req, res, next) {
	if(PUBLIC_PATHS.indexOf(req.path) > -1) {
		// path is exempt from authentication layer
		next();
	} else {
		jwtFilter.jwtBearerTokenAuth(req, res, next);
	}
});

// Returns info about the access token
router.get('/', function (req, res) {
	let response = { message: 'OK' };
	return res.status(200).json(response);
});

module.exports = router;
