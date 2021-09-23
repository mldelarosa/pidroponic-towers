var app;
const CLIENT_NAME = 'pidroponics-webapp';

$( document ).ready(function() {
	app = new Pidroponics(document.getElementById('pidroponics'));
	app.onEvent(EVENT.PAGE_LOAD, {});
});

function registerDomListeners() {
	$('#btn__connect-new-device').click(didClickPidroponicsConnect);
};

function didClickPidroponicsConnect() {
	let newUsername = document.getElementById('txt__new-username');
	let data = {
		username: newUsername.value,
		client: CLIENT_NAME
	};
	app.onEvent(EVENT.DID_SUBMIT_NEW_USER, data);
};

function did() {
	var jwtDisplayTemplateElement = document.getElementById('jwtDisplayTemplate');
	var jwtDisplayElement = document.getElementById('jwt');
	var accessTokenRefreshInterval = 

	function stopAccessTokenRefresh() {
		clearInterval(accessTokenRefreshInterval);
	};
}