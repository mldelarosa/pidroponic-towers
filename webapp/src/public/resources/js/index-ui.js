var app;
const CLIENT_NAME = 'pidroponics-webapp';

$( document ).ready(function() {
	app = new Pidroponics(document.getElementById('pidroponics'));
	app.onEvent(EVENT.PAGE_LOAD, {});
});

function registerDomListeners() {
	$('#btn__connect-new-device').click(didClickPidroponicsConnect);
	$('#btn__get-temperature-readout').click(didClickReadTemperature);
	$('#btn__get-humidity-readout').click(didClickReadHumidity);
	$('#btn__get-light-readout').click(didClickReadLight);
	$('#btn__toggle-light').click(didClickToggleLight);
};

function didClickPidroponicsConnect() {
	let newUsername = document.getElementById('txt__new-username');
	let data = {
		username: newUsername.value,
		client: CLIENT_NAME
	};
	app.onEvent(EVENT.DID_SUBMIT_NEW_USER, data);
};

function didClickReadTemperature() {
	let txtTemperature = document.getElementById('txt__readout-temperature');
	promiseToGetTemperatureReadout(getAccessToken()).then(
		readout => {
			txtTemperature.value = readout;
		},
		xhr => {
			console.log('There was a problem requesting temperature sensor readout.');
			console.log(xhr);
	});
};

function didClickReadHumidity() {
	let txtHumidity = document.getElementById('txt__readout-humidity');
	promiseToGetHumidityReadout(getAccessToken()).then(
		readout => {
			txtHumidity.value = readout;
		},
		xhr => {
			console.log('There was a problem requesting humidity sensor readout.');
			console.log(xhr);
	});
};

function didClickReadLight() {
	let txtLight = document.getElementById('txt__readout-light');
	promiseToGetLightStatus(getAccessToken()).then(
		lightData => {
			txtLight.value = JSON.stringify(lightData.state);
		},
		xhr => {
			console.log('There was a problem requesting light device status.');
			console.log(xhr);
	});
};

function didClickToggleLight() {
	let txtLight = document.getElementById('txt__readout-light');
	promiseToToggleLightStatus(getAccessToken()).then(
		lightData => {
			txtLight.value = JSON.stringify(lightData.state);
		},
		xhr => {
			console.log('There was a problem requesting light device status.');
			console.log(xhr);
	});
};
