'use strict'
var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const jwtFilter = require('../controllers/filters/bearer-token-jwt');

const JWT_SIGNING_SECRET = 'changeme';
const PUBLIC_PATHS = [
	'/token'
];
var tokenRequestCount = 0;

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
router.get('/me', function (req, res) {
	let response = { jwt: req.jwt, message: 'Successfully verified bearer token.' };
	return res.status(200).json(response);
});

// Generates and returns a simple JWT
router.post('/token', function (req, res) {
	// return a token every 3 tries...
	tokenRequestCount++;
	if(tokenRequestCount > 2) {
		let token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + (60 * 10), //expires in 10 mins
			nbf: Math.floor(Date.now() / 1000),
			aud: 'pidroponics-web-client',
			iss: 'https://auth.pidroponics.app',
			sub: '*', // anonymous user
			}, JWT_SIGNING_SECRET);
		tokenRequestCount = 0;
		res.status(200).json({ jwt: token });
	} else {
		res.status(401).json({ message: 'Try again...' });
	}
});

module.exports = router;
