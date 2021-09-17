'use strict'
var express = require('express');
var router = express.Router();
const jwtBuilder = require( 'jwt-builder' );

var tokenRequestCount = 0;

// timestamp middleware
router.use(function timeLog (req, res, next) {
	console.log('Time: ', Date.now());
	next();
});

// Generates and returns a simple JWT
router.post('/token', function (req, res) {
	// return a token every 5 tries...
	tokenRequestCount++;
	if(tokenRequestCount >= 5) {
		let token = jwtBuilder( {
			algorithm: 'HS256',
			secret: 'changeme',
			nbf: true,
			exp: 600, // expires in 10 mins
			iss: 'https://auth.pidroponics.app',
			sub: 'some-user'
		});
		tokenRequestCount = 0;
		let response = {};
		response.jwt = token;
		res.send(response);
	}
});

module.exports = router;