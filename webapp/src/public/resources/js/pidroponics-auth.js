'use strict'
var LOGOUT_URL = '/auth/logout';
var accessTokenRefreshInterval;

function setAccessTokenRefreshInterval(intervalMs) {
	accessTokenRefreshInterval = window.setInterval(function() {
		promiseToRequestAccessToken(getRefreshToken()).then(
			accessToken => {
				console.log('Successfuly refreshed access token.');
				console.log(accessToken);
				setAccessToken(accessToken);
			},
			xhr => {
				console.log('There was a problem requesting an access token.');
				console.log(xhr);
		});
	}, intervalMs);
}

function promiseToRefreshAccessToken() {
	return new Promise((resolve, reject) => {
		let expiresInMs = 0;
		if(getAccessToken()) {
			let accessToken = parseJwt(getAccessToken());
			let expiryMs = accessToken.exp * 1000;
			let nowMs = Date.now();
			if(nowMs < expiryMs) {
				expiresInMs = expiryMs - nowMs;
				console.log('Access token has not yet expired. Expires in [' + expiresInMs + ' ms].');
				resolve();
			}
		}
		setTimeout(function() {
			promiseToRequestAccessToken(getRefreshToken()).then(
				accessToken => {
					setAccessToken(accessToken);
					let accessTokenObj = parseJwt(accessToken);
					console.log('Access token successfully refreshed.');
					setAccessTokenRefreshInterval((accessTokenObj.exp - accessTokenObj.iat) * 1000);
					resolve();
				},
				xhr => {
					console.log('There was a problem refreshing the access token.');
					console.log(xhr);
					if(xhr.status == 401) {
						console.log('There was an issue with authorization. Refreshing credentials.');
						reauth();
					}
					reject();
				});
		}, expiresInMs);
	});
}
/* Auth Helper Functions */

function reauth() {
	console.log("Reauthing...");
	sessionStorage.removeItem(SESSION_KEY_REFRESH_TOKEN);
	sessionStorage.removeItem(SESSION_KEY_ACCESS_TOKEN);
}

function setRefreshToken(newRefreshToken) {
	sessionStorage.setItem(SESSION_KEY_REFRESH_TOKEN, newRefreshToken);
};
function getRefreshToken() {
	return sessionStorage.getItem(SESSION_KEY_REFRESH_TOKEN);
};

function setAccessToken(newAccessToken) {
	sessionStorage.setItem(SESSION_KEY_ACCESS_TOKEN, newAccessToken);
};
function getAccessToken() {
	return sessionStorage.getItem(SESSION_KEY_ACCESS_TOKEN);
};

function parseJwt(jwt) {
	let bodyBase64 = jwt.split('.')[1];
	return JSON.parse(atob(bodyBase64));
};
