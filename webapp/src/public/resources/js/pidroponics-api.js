'use strict'

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
