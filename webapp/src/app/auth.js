'use strict'
var express = require('express');
var router = express.Router();
const jwtBuilder = require( 'jwt-builder' );

// timestamp middleware
router.use(function timeLog (req, res, next) {
	console.log('Time: ', Date.now());
	next();
});

// Generates and returns a simple JWT
router.post('/token', function (req, res) {
	let token = jwtBuilder( {
		algorithm: 'HS256',
		secret: 'changeme',
		nbf: true,
		exp: 600, // expires in 10 mins
		iss: 'https://auth.pidroponics.app',
		sub: 'some-user'
	});
	res.send(token);
})

module.exports = router