'use strict'
const JWT_SIGNING_SECRET = 'changeme';
const jwt = require('jsonwebtoken');

async function jwtBearerTokenAuth(req, res, next) {
	// Check for Bearer token in auth header
	if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
		return res.status(401).json({ message: 'Missing Authorization Header' });
	}

	// Verify token and return info about the access token
	const bearerToken =  req.headers.authorization.split(' ')[1];
	let accessToken = {};
	try {
		accessToken = jwt.verify(bearerToken, JWT_SIGNING_SECRET);
		req.jwt = accessToken;
		next();
	} catch(err) {
		console.warn('Failed to verify JWT bearer token.');
		console.error(err);
		return res.status(401).json({ message: 'Could not verify bearer token.'});
	}
}

exports.jwtBearerTokenAuth = jwtBearerTokenAuth;
