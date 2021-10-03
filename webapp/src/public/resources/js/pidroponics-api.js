'use strict'

/* Auth API */
function promiseToRequestAccessToken(refreshToken) {
	return new Promise((resolve, reject) => {
		$.ajax({
			method: 'POST',
			url: '/api/auth/token',
			data: {
				refresh_token: refreshToken
			},
			dataType: 'json',
			timeout: 1000,
			success: function(data,status,xhr) {
				console.log('Request for access token succeeded');
				console.log(data);
				let accessToken = data.jwt;
				resolve(accessToken);
			},
			error: function(xhr, textStatus, errorMessage) {
				console.log('There was a problem requesting an access token...');
				console.log(xhr);
				reject(xhr);
			}
		});
	});
};

function promiseToGetNewAuthorizedUser(newUsername, newClient) {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "POST",
			url: '/api/auth/user',
			data: {
				username: newUsername,
				client: newClient
			},
			dataType: 'json',
			success: function(data) {
				resolve(data);
			},
			error: function(xhr, status, error) {
				console.log('Error requesting new user authorization from Pidroponics');
				console.log(status);
				console.log(error);
				reject(xhr);
			}// end -- error
		}); // end -- ajax
	}); // end -- promise
};// end -- promiseToGetNewAuthorizedUser

/* Status API */

function promiseToGetStatus(bearerToken) {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "GET",
			url: '/api/status',
			dataType: 'json',
			headers: { Authorization: 'Bearer ' + bearerToken },
			success: function(data) {
				resolve(data);
			},
			error: function(xhr, status, error) {
				console.log('Error requesting new username from Pidroponics');
				console.log(status);
				console.log(error);
				if (xhr.status == 401) {
					reauth();
				}
			}
		});
	});
};

/* Sensor API */

function promiseToGetSensorReadout(sensor, bearerToken) {
	let sensorReadoutPath = '/api/device/sensor/' + sensor;
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "GET",
			url: sensorReadoutPath,
			dataType: 'json',
			headers: { Authorization: 'Bearer ' + bearerToken },
			success: function(data) {
				resolve(data.readout);
			},
			error: function(xhr, status, error) {
				console.log('Error requesting temperature readout.');
				console.log(xhr);
				if (xhr.status == 401) {
					reauth();
				}
				reject(xhr);
			}
		});
	});
}

/* Device API */
function promiseToGetDeviceStatus(device, bearerToken) {
	let deviceReadoutPath = '/api/device/' + device;
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "GET",
			url: deviceReadoutPath,
			dataType: 'json',
			headers: { Authorization: 'Bearer ' + bearerToken },
			success: function(data) {
				let dataObj = JSON.parse(data);
				resolve(dataObj);
			},
			error: function(xhr, status, error) {
				console.log('Error requesting temperature readout.');
				console.log(xhr);
				if (xhr.status == 401) {
					reauth();
				}
				reject(xhr);
			}
		});
	});
}

function promiseToGetTemperatureReadout(bearerToken) {
	return promiseToGetSensorReadout('temperature', bearerToken);
};

function promiseToGetHumidityReadout(bearerToken) {
	return promiseToGetSensorReadout('humidity', bearerToken);
};

function promiseToGetLightStatus(bearerToken) {
	return promiseToGetDeviceStatus('light', bearerToken);
};

function promiseToToggleLightStatus(bearerToken) {
	let deviceReadoutPath = '/api/device/light';
	return new Promise((resolve, reject) => {
		let cmdData = { cmd: 'toggle' };
		$.ajax({
			type: "POST",
			url: deviceReadoutPath,
			dataType: 'json',
			data: cmdData,
			headers: { Authorization: 'Bearer ' + bearerToken },
			success: function(data) {
				let dataObj = JSON.parse(data);
				resolve(dataObj);
			},
			error: function(xhr, status, error) {
				console.log('Error requesting temperature readout.');
				console.log(xhr);
				if (xhr.status == 401) {
					reauth();
				}
				reject(xhr);
			}
		});
	});
}