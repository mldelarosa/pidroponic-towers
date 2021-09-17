'use strict'
var LOGOUT_URL = '/auth/logout';

var SS_STATE = 'pidroponics.state';
var SS_JWT_ACCESS_TOKEN = 'pidroponics.jwt.acccess';
var SS_JWT_REFRESH_TOKEN = 'pidroponics.jwt.refresh';

function requestAccessToken() {
	$.ajax({
		method: 'POST',
		url: '/auth/token',
		dataType: 'json',
		timeout: 1000,
		success: function (data,status,xhr) {
			console.log('Request for access token succeeded');
			console.log(data);
			let accessToken = data.jwt;
			sessionStorage.setItem(SS_JWT_ACCESS_TOKEN, accessToken);
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log('There was a problem requesting an access token...');
			console.log(jqXhr);
		}
	});
}

function reauth() {
	console.log("Reauthing...");
	sessionStorage.removeItem(SS_JWT_ACCESS_TOKEN);
}

function deauth() {
	sessionStorage.removeItem(SS_JWT_ACCESS_TOKEN);
	location.assign(LOGOUT_URL);
}

function getAccessToken() {
	return sessionStorage.getItem(SS_JWT_ACCESS_TOKEN);
}

function ajaxBeforeSendFunc(xhr) {
	xhr.setRequestHeader('Authorization', 'Bearer '+getAccessToken());
}
