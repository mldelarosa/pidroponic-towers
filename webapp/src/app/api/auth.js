'use strict'
var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const jwtFilter = require('../../controllers/filters/bearer-token-jwt');

const JWT_SIGNING_SECRET = 'changeme';
const PUBLIC_PATHS = [
	'/token',
	'/user'
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
	const { refresh_token } = req.body;
	if (!refresh_token) {
		res.status(400).json({ message: "Missing param ['refresh_token']."});
	}

	// Query for refresh token
	if(refresh_token != 'test-refresh-token') {
		res.status(401).json({ message: "Invalid refresh token."});
	} else {
		let token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + (60 * 10), //expires in 10 mins
			nbf: Math.floor(Date.now() / 1000),
			aud: 'pidroponics-web-client',
			iss: 'https://auth.pidroponics.app',
			sub: '*', // anonymous user
			}, JWT_SIGNING_SECRET);
		tokenRequestCount = 0;
		res.status(200).json({ jwt: token });
	}
});

// Creates a new user
router.post('/user', function (req, res) {
	const { username, client } = req.body;
	if (!(username && client)) {
		res.status(400).json({ message: "Missing a param for one or more of ['username', 'client']."});
		return;
	}
	if(!/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(username)) {
		res.status(400).json({ message: "Invalid username ['" + username + "']."});
		return;
	}
	if(!/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(client)) {
		res.status(400).json({ message: "Invalid client name ['" + client + "']."});
		return;
	}

	// Generate a user-id and refresh token...
	let newUserId = 'some-user-id';
	let newRefreshToken = 'test-refresh-token';

	// return a token every 3 tries...
	tokenRequestCount++;
	if(tokenRequestCount > 2) {
		let user = {
			username: username,
			user_id: newUserId,
			client: client,
			refresh_token: newRefreshToken
		};
		tokenRequestCount = 0;
		res.status(200).json(user);
		user.refresh_token = '***';
		console.log('Created new User!');
		console.log(user);
	} else {
		console.log('Arbitrarily denying request for a new user:');
		console.log(req.body);
		res.status(401).json({ message: 'Try again...' });
	}
});

module.exports = router;
